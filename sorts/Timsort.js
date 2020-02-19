function Timsort(values) {
    var MIN_GALLOP = 7;
    var MERGESTATE_TEMP_SIZE = 16;

    var listsort = function (array) {
        if (array.length < 2) {
            return;
        }

        var ms = merge_init();
        var remaining = values.length;
        var lo = values.pointer("lo");
        var hi = values.pointer("hi", remaining);
        var minrun = merge_compute_minrun(remaining);
        do {
            var run = count_run(lo, hi);
            var n = run.count;

            if (run.descending) {
                var reverse_hi = lo.clone("hi").add(n);
                reverse_slice(lo, reverse_hi);
                reverse_hi.destroy();
            }

            if (n < minrun) {
                var force = Math.min(remaining, minrun);
                var binsort_hi = lo.clone("hi").add(force);
                var binsort_start = lo.clone("start").add(n);
                binarysort(lo, binsort_hi, binsort_start);
                binsort_hi.destroy();
                binsort_start.destroy();
                n = force;
            }

            ms.push({ base: lo.clone("base"), length: n });
            merge_collapse(ms);
            lo.add(n);
            remaining -= n;
        }
        while (remaining > 0);

        merge_force_collapse(ms);
        ms[0].base.destroy();
        merge_freemem(ms);
        lo.destroy();
        hi.destroy();
    };

    var count_run = function (lo, hi) {
        if (lo.value == hi.value - 1) {
            return { count: 1, descending: false };
        }

        var i = lo.clone("i").add(1);
        var n = 2
        var descending = lo.array.compare(i, i.value - 1) < 0;

        for (i.add(1); i.value < hi.value; i.add(1), n++) {
            if (i.array.compare(i, i.value - 1) < 0 ? !descending : descending) {
                break;
            }
        }

        i.destroy();
        return { count: n, descending: descending };
    };

    var reverse_slice = function (lo, hi) {
        var limit = (hi.value - lo.value) >> 1;
        for (var i = 0; i < limit; i++) {
            lo.array.swap(lo.value + i, hi.value - i - 1);
        }
    };

    var binarysort = function (lo, hi, start) {
        start = start.clone("start");
        if (lo.value == start.value) {
            start.add(1);
        }

        var l = lo.clone("l");
        var r = lo.clone("r");
        var p = lo.clone("p");

        for (; start.value < hi.value; start.add(1)) {
            l.set(lo);
            r.set(start);
            var pivot = r.clone("pivot");
            do {
              p.set(l).add((r.value - l.value) >> 1);
              if (p.array.compare(pivot, p) < 0) {
                  r.set(p);
              } else {
                  l.set(p).add(1);
              }
            } while(l.value < r.value);

            var indices = [];
            for (p.set(start); p.value >= l.value; p.sub(1)) {
                indices.push(p.value);
            }

            p.array.swap.apply(p.array, indices);

            pivot.destroy();
        }

        l.destroy();
        r.destroy();
        p.destroy();
        start.destroy();
    };

    var merge_init = function () {
        var ms = [];
        ms.array = null;
        ms.min_gallop = MIN_GALLOP;
        return ms;
    };

    var merge_getmem = function (ms, need) {
        if (ms.array && need <= ms.array.length)
            return 0;
        merge_freemem(ms);
        ms.array = new SortArray(Math.max(need, MERGESTATE_TEMP_SIZE));
    };

    var merge_freemem = function (ms) {
        if (ms.array) {
            ms.array.destroy();
        }

        ms.array = null;
    };

    var merge_compute_minrun = function (count) {
        var r = 0;
        while (count >= 64) {
            r = r | (count & 1);
            count = count >> 1;
        }
        return count + r;
    };

    var merge_collapse = function (ms) {
        while (ms.length > 1) {
            var n = ms.length - 2;
            if (n > 0 && ms[n - 1].length <= ms[n].length + ms[n + 1].length) {
                if (ms[n - 1].length < ms[n + 1].length) {
                    n--;
                }
                merge_at(ms, n);
            }
            else if (ms[n].length <= ms[n + 1].length) {
                merge_at(ms, n)
            }
            else {
                break;
            }
        }
    };

    var merge_force_collapse = function (ms) {
        while (ms.length > 1) {
            var n = ms.length - 2;
            if (n > 0 && ms[n - 1].length < ms[n + 1].length) {
                n--;
            }
            merge_at(ms, n);
        }
        return 0;
    };

    var merge_at = function (ms, i) {
        var pa = ms[i].base;
        var na = ms[i].length;
        var pb = ms[i + 1].base;
        var nb = ms[i + 1].length;

        ms[i].length += nb;
        ms.splice(i + 1, 1);

        var k = gallop_right(pb, pa, na, 0);
        na -= k;
        if (na == 0) {
            pb.destroy();
            return;
        }

        pa = pa.clone("pa").add(k);

        var pa_na = pa.clone("pa").add(na - 1);
        nb = gallop_left(pa_na, pb, nb, nb - 1);

        na <= nb
          ? merge_lo(ms, pa, na, pb, nb)
          : merge_hi(ms, pa, na, pb, nb);

        pa.destroy();
        pa_na.destroy();
        pb.destroy();
    };

    var merge_hi = function (ms, pa, na, pb, nb) {
        var min_gallop;

        merge_getmem(ms, nb);

        SortArray.memcpy(ms.array, pb, nb);

        var dest = pb.clone("dest").add(nb - 1);
        var basea = pa.clone("basea");
        var baseb = ms.array.pointer("baseb", 0);
        pb = ms.array.pointer("pb", nb - 1);
        pa = pa.clone("pa").add(na - 1);

        var gotoSucceed = false, gotoCopyA = false;

        ArrayPointer.assignAndDecrement(dest, pa);
        na--;
        if (na == 0) {
            gotoSucceed = true;
        }
        else if (nb == 1) {
            gotoCopyA = true;
        }

        if (!(gotoSucceed || gotoCopyA)) {
            min_gallop = ms.min_gallop;
            while (true) {
                var acount = 0;
                var bcount = 0;

                while (true) {
                    var k = SortArray.compare(pb.array, pb, pa.array, pa) < 0 ? 1 : 0;
                    if (k) {
                        ArrayPointer.assignAndDecrement(dest, pa);
                        acount++;
                        bcount = 0;
                        na--;
                        if (na == 0) {
                            gotoSucceed = true;
                            break;
                        }
                        if (acount >= min_gallop) {
                            break;
                        }
                    }
                    else {
                        ArrayPointer.assignAndDecrement(dest, pb);
                        bcount++;
                        acount = 0;
                        nb--;
                        if (nb == 1) {
                            gotoCopyA = true;
                            break;
                        }
                        if (bcount >= min_gallop) {
                            break;
                        }
                    }
                }

                if (!(gotoSucceed || gotoCopyA)) {
                    min_gallop++;
                    do {
                        min_gallop -= (min_gallop > 1 ? 1 : 0);
                        ms.min_gallop = min_gallop;
                        var k = gallop_right(pb, basea, na, na - 1);
                        k = na - k;
                        acount = k;
                        if (k) {
                            memmove(dest, pa, k);
                            dest.sub(k);
                            pa.sub(k);
                            na -= k;
                            if (na == 0) {
                                gotoSucceed = true;
                                break;
                            }
                        }
                        ArrayPointer.assignAndDecrement(dest, pb);
                        nb--;
                        if (nb == 1) {
                            gotoCopyA = true;
                            break;
                        }

                        k = gallop_left(pa, baseb, nb, nb - 1);
                        k = nb - k;
                        bcount = k;
                        if (k) {
                            memcpy(dest, pb, k);
                            dest.sub(k);
                            pb.sub(k);
                            nb -= k;
                            if (nb == 1) {
                                gotoCopyA = true;
                                break;
                            }
                            if (nb == 0) {
                                gotoSucceed = true;
                                break;
                            }
                        }
                        ArrayPointer.assignAndDecrement(dest, pa);
                        na--;
                        if (na == 0) {
                            gotoSucceed = true;
                            break;
                        }
                    } while (acount >= MIN_GALLOP || bcount >= MIN_GALLOP);
                }

                if (gotoSucceed || gotoCopyA) {
                    break;
                }

                min_gallop++;
                ms.min_gallop = min_gallop;
            }
        }

        if (!gotoCopyA) {
            if (nb > 0) {
                SortArray.memcpy(dest.sub(nb - 1), baseb, nb);
            }
        } else {
            dest.sub(na - 1);
            pa.sub(na - 1);
            memmove(dest, pa, na);
            dest.sub(1);
            dest.assign(pb);
        }

        dest.destroy();
        basea.destroy();
        baseb.destroy();
        pa.destroy();
        pb.destroy();
    };

    var merge_lo = function (ms, pa, na, pb, nb) {
        var min_gallop;

        merge_getmem(ms, na);

        SortArray.memcpy(ms.array, pa, na);

        var dest = pa.clone("dest");
        pa = ms.array.pointer("pa", 0);
        pb = pb.clone("pb");

        var gotoSucceed = false, gotoCopyB = false;

        ArrayPointer.assignAndIncrement(dest, pb);
        nb--;
        if (nb == 0) {
            gotoSucceed = true;
        }
        else if (na == 1) {
            gotoCopyB = true;
        }

        if (!(gotoSucceed || gotoCopyB)) {
            min_gallop = ms.min_gallop;
            while (true) {
                var acount = 0;
                var bcount = 0;

                while (true) {
                    var k = SortArray.compare(pb.array, pb, pa.array, pa) < 0 ? 1 : 0;
                    if (k) {
                        ArrayPointer.assignAndIncrement(dest, pb);
                        bcount++;
                        acount = 0;
                        nb--;
                        if (nb == 0) {
                            gotoSucceed = true;
                            break;
                        }
                        if (bcount >= min_gallop) {
                            break;
                        }
                    }
                    else {
                        ArrayPointer.assignAndIncrement(dest, pa);
                        acount++;
                        bcount = 0;
                        na--;
                        if (na == 1) {
                            gotoCopyB = true;
                            break;
                        }
                        if (acount >= min_gallop) {
                            break;
                        }
                    }
                }

                if (!(gotoSucceed || gotoCopyB)) {
                    min_gallop++;
                    do {
                        min_gallop -= (min_gallop > 1 ? 1 : 0);
                        ms.min_gallop = min_gallop;
                        var k = gallop_right(pb, pa, na, 0);
                        acount = k;
                        if (k) {
                            SortArray.memcpy(dest, pa, k);
                            dest.add(k);
                            pa.add(k);
                            na -= k;
                            if (na == 1) {
                                gotoCopyB = true;
                                break;
                            }
                            if (na == 0) {
                                gotoSucceed = true;
                                break;
                            }
                        }
                        ArrayPointer.assignAndIncrement(dest, pb);
                        nb--;
                        if (nb == 0) {
                            gotoSucceed = true;
                            break;
                        }

                        k = gallop_left(pa, pb, nb, 0);
                        bcount = k;
                        if (k) {
                            memmove(dest, pb, k);
                            dest.add(k);
                            pb.add(k);
                            nb -= k;
                            if (nb == 0) {
                                gotoSucceed = true;
                                break;
                            }
                        }
                        ArrayPointer.assignAndIncrement(dest, pa);
                        na--;
                        if (na == 1) {
                            gotoCopyB = true;
                            break;
                        }
                    } while (acount >= MIN_GALLOP || bcount >= MIN_GALLOP);
                }

                if (gotoSucceed || gotoCopyB) {
                    break;
                }

                min_gallop++;
                ms.min_gallop = min_gallop;
            }
        }

        if (!gotoCopyB) {
            if (na > 0) {
                SortArray.memcpy(dest, pa, na);
            }
        } else {
            memmove(dest, pb, nb);
            dest.array.set(dest.value + nb, pa);
        }

        dest.destroy();
        pa.destroy();
        pb.destroy();
    };

    var memmove = function (dst, src, num) {
        dst = dst.clone("dst");
        src = src.clone("src");

        var buffer = [];
        for (var i = 0; i < num; i++, src.add(1)) {
            buffer[i] = src.array.get(src);
        }
        for (var i = 0; i < num; i++, dst.add(1)) {
            dst.assign(buffer[i]);
        }

        dst.destroy();
        src.destroy();
    };

    var gallop_left = function (key, a, n, hint) {
        a = a.clone('a').add(hint);
        var lastofs = 0;
        var ofs = 1;
        if (SortArray.compare(a.array, a, key.array, key) < 0) {
            var maxofs = n - hint;
            while (ofs < maxofs) {
                if (SortArray.compare(a.array, a.value + ofs, key.array, key) >= 0) {
                    break;
                }
                lastofs = ofs;
                ofs = (ofs << 1) + 1;
                if (ofs <= 0) {
                    ofs = maxofs;
                }
            }
            if (ofs > maxofs) {
                ofs = maxofs;
            }
            lastofs += hint;
            ofs += hint;
        }
        else {
            var maxofs = hint + 1;
            while (ofs < maxofs) {
                if(SortArray.compare(a.array, a.value - ofs, key.array, key) < 0) {
                    break;
                }
                lastofs = ofs;
                ofs = (ofs << 1) + 1;
                if (ofs <= 0) {
                    ofs = maxofs;
                }
            }
            if (ofs > maxofs) {
                ofs = maxofs;
            }
            var k = lastofs;
            lastofs = hint - ofs;
            ofs = hint - k;
        }
        a.sub(hint);

        lastofs++;
        while (lastofs < ofs) {
            var m = lastofs + ((ofs - lastofs) >> 1);

            if (SortArray.compare(a.array, a.value + m, key.array, key) >= 0) {
                ofs = m;
            }
            else {
                lastofs = m + 1;
            }
        }

        a.destroy();
        return ofs;
    };

    var gallop_right = function (key, a, n, hint) {
        a = a.clone('a').add(hint);
        var lastofs = 0;
        var ofs = 1;
        if (SortArray.compare(key.array, key, a.array, a) < 0) {
            var maxofs = hint + 1;
            while (ofs < maxofs) {
                if(SortArray.compare(key.array, key, a.array, a.value - ofs) >= 0) {
                    break;
                }
                lastofs = ofs;
                ofs = (ofs << 1) + 1;
                if (ofs <= 0) {
                    ofs = maxofs;
                }
            }
            if (ofs > maxofs) {
                ofs = maxofs;
            }
            var k = lastofs;
            lastofs = hint - ofs;
            ofs = hint - k;
        }
        else {
            var maxofs = n - hint;
            while (ofs < maxofs) {
                if (SortArray.compare(key.array, key, a.array, a.value + ofs) < 0) {
                    break;
                }
                lastofs = ofs;
                ofs = (ofs << 1) + 1;
                if (ofs <= 0) {
                    ofs = maxofs;
                }
            }
            if (ofs > maxofs) {
                ofs = maxofs;
            }
            lastofs += hint;
            ofs += hint;
        }
        a.sub(hint);

        lastofs++;
        while (lastofs < ofs) {
            var m = lastofs + ((ofs - lastofs) >> 1);

            if (SortArray.compare(key.array, key, a.array, a.value + m) < 0) {
                ofs = m;
            }
            else {
                lastofs = m + 1;
            }
        }

        a.destroy();
        return ofs;
    };

    listsort(values);
}

if (SortAlgorithms) {
    SortAlgorithms["Timsort"] = { name: "Timsort", sort: Timsort };
}
