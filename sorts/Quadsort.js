function Quadsort(values) {
    var quadswap = function (array) {
        var offset = array.pointer("offset");

        for (offset.set(0); offset.value + 4 <= array.length; offset.add(4)) {
            if (array.compare(offset, offset.value + 1) > 0) {
                array.swap(offset, offset.value + 1);
            }

            if (array.compare(offset.value + 2, offset.value + 3) > 0) {
                array.swap(offset.value + 2, offset.value + 3);
            }

            if (array.compare(offset.value + 1, offset.value + 2) > 0) {
                if (array.compare(offset.value, offset.value + 3) > 0) {
                    array.swap(offset, offset.value + 2);
                    array.swap(offset.value + 1, offset.value + 3);
                }
                else if (array.compare(offset, offset.value + 2) <= 0) {
                    if (array.compare(offset.value + 1, offset.value + 3) <= 0) {
                        array.swap(offset.value + 1, offset.value + 2);
                    }
                    else {
                        array.swap(offset.value + 1, offset.value + 2, offset.value + 3);
                    }
                }
                else {
                    if (array.compare(offset.value + 1, offset.value + 3) <= 0) {
                        array.swap(offset, offset.value + 2, offset.value + 1);
                    }
                    else {
                        array.swap(offset, offset.value + 2, offset.value + 3, offset.value + 1);
                    }
                }
            }
        }

        switch (array.length - offset.value) {
            case 2:
                if (array.compare(offset, offset.value + 1) > 0) {
                    array.swap(offset, offset.value + 1);
                }
                break;

            case 3:
                if (array.compare(offset, offset.value + 1) > 0) {
                    array.swap(offset, offset.value + 1);
                }
                if (array.compare(offset.value + 1, offset.value + 2) > 0) {
                    array.swap(offset.value + 1, offset.value + 2);
                }
                if (array.compare(offset, offset.value + 1) > 0) {
                    array.swap(offset, offset.value + 1);
                }
                break;
        }

        offset.destroy();
    };

    var quadsort = function (array, swap) {
        var offset;
        var block = 4;
        var pta = array.pointer("a");
        var pts = swap.pointer("s");
        var c = array.pointer("c");
        var c_max = array.pointer("c_max");
        var d = array.pointer("d");
        var d_max = array.pointer("d_max");

        var end = array.length;

        while (block < array.length) {
            offset = 0;

            while (offset + block < array.length) {
                pta.set(offset);

                d_max.set(pta).add(block);

                var gotoStep3 = false, gotoStep2 = false, gotoQuickstep = false;

                if (array.compare(d_max.value - 1, d_max) <= 0) {
                    if (offset + block * 3 < array.length) {
                        d_max.set(pta).add(block * 3);

                        if (array.compare(d_max.value - 1, d_max) <= 0) {
                            d_max.set(pta).add(block * 2);

                            if (array.compare(d_max.value - 1, d_max) <= 0) {
                                offset += block * 4;
                                continue;
                            }
                            pts.set(0);

                            c.set(pta);
                            c_max.set(pta).add(block * 2);
                            d.set(c_max);
                            offset + block * 4 <= array.length ? d_max.set(d).add(block * 2) : d_max.set(end);

                            while (c.value < c_max.value) {
                                ArrayPointer.assignAndIncrement(pts, c);
                            }

                            while (d.value < d_max.value) {
                                ArrayPointer.assignAndIncrement(pts, d);
                            }

                            gotoStep3 = true;
                        }
                        
                        if (!gotoStep3) {
                            pts.set(0);

                            c.set(pta);
                            c_max.set(pta).add(block * 2);

                            while (c.value < c_max.value) {
                                ArrayPointer.assignAndIncrement(pts, c);
                            }

                            gotoStep2 = true;
                        }
                    }
                    else if (offset + block * 2 < array.length) {
                        d_max.set(pta).add(block * 2);

                        if (array.compare(d_max.value - 1, d_max) <= 0)
                        {
                            offset += block * 4;
                            continue;
                        }
                        pts.set(0);

                        c.set(pta);
                        c_max.set(pta).add(block * 2);

                        while (c.value < c_max.value) {
                            ArrayPointer.assignAndIncrement(pts, c);
                        }

                        gotoStep2 = true;
                    }
                    else
                    {
                        offset += block * 4;
                        continue;
                    }
                }

                if (!gotoStep2 && !gotoStep3) {
                    // step1:

                    pts.set(0);

                    c.set(pta);
                    c_max.set(pta).add(block);

                    d.set(c_max);
                    offset + block * 2 <= array.length ? d_max.set(d).add(block) : d_max.set(end);

                    if (array.compare(c_max.value - 1, d_max.value - 1) <= 0) {
                        while (c.value < c_max.value)
                        {
                            while (array.compare(c, d) > 0) {
                                ArrayPointer.assignAndIncrement(pts, d);
                            }

                            ArrayPointer.assignAndIncrement(pts, c);
                        }
                        while (d.value < d_max.value) {
                            ArrayPointer.assignAndIncrement(pts, d);
                        }
                    }
                    else if (array.compare(c, d_max.value - 1) > 0) {
                        while (d.value < d_max.value) {
                            ArrayPointer.assignAndIncrement(pts, d);
                        }

                        while (c.value < c_max.value) {
                            ArrayPointer.assignAndIncrement(pts, c);
                        }
                    }
                    else {
                        while (d.value < d_max.value)
                        {
                            while (array.compare(c, d) <= 0) {
                                ArrayPointer.assignAndIncrement(pts, c);
                            }

                            ArrayPointer.assignAndIncrement(pts, d);
                        }

                        while (c.value < c_max.value) {
                            ArrayPointer.assignAndIncrement(pts, c);
                        }
                    }
                }

                step2:
                gotoStep2 = false;
                if (!gotoStep3) {
                    if (offset + block * 2 < array.length) {
                        c.set(pta).add(block * 2);

                        if (offset + block * 3 < array.length) {
                            c_max.set(c).add(block);
                            d.set(c_max);
                            offset + block * 4 <= array.length ? d_max.set(d).add(block) : d_max.set(end);

                            if (array.compare(c_max.value - 1, d_max.value - 1) <= 0) {
                                while (c.value < c_max.value) {
                                    while (array.compare(c, d) > 0) {
                                        ArrayPointer.assignAndIncrement(pts, d);
                                    }

                                    ArrayPointer.assignAndIncrement(pts, c);
                                }

                                while (d.value < d_max.value) {
                                    ArrayPointer.assignAndIncrement(pts, d);
                                }
                            }
                            else if (array.compare(c, d_max.value - 1) > 0) {
                                while (d.value < d_max.value) {
                                    ArrayPointer.assignAndIncrement(pts, d);
                                }

                                while (c.value < c_max.value) {
                                    ArrayPointer.assignAndIncrement(pts, c);
                                }
                            }
                            else {
                                while (d.value < d_max.value) {
                                    while (array.compare(c, d) <= 0) {
                                        ArrayPointer.assignAndIncrement(pts, c);
                                    }

                                    ArrayPointer.assignAndIncrement(pts, d);
                                }

                                while (c.value < c_max.value) {
                                    ArrayPointer.assignAndIncrement(pts, c);
                                }
                            }
                        }
                        else {
                            d.set(c);
                            d_max.set(end);

                            pts.set(0);
                            c.set(pts);
                            c_max.set(c).add(block * 2);

                            gotoQuickstep = true;
                        }
                    }
                }

                step3:
                gotoStep3 = false;

                if (!gotoQuickstep) {
                    pts.set(0);

                    c.set(pts);
                }

                if (gotoQuickstep || offset + block * 2 < array.length) {
                    if (!gotoQuickstep) {
                        c_max.set(c).add(block * 2);

                        d.set(c_max);
                        offset + block * 4 <= array.length ? d_max.set(d).add(block * 2) : d_max.set(pts).add(array.length - offset);
                    }

                    quickstep:
                    gotoQuickstep = false;

                    if (SortArray.compare(swap, c_max.value - 1, d_max.array, d_max.value - 1) <= 0) {
                        while (c.value < c_max.value) {
                            while (SortArray.compare(swap, c, d.array, d) > 0) {
                                ArrayPointer.assignAndIncrement(pta, d);
                            }

                            ArrayPointer.assignAndIncrement(pta, c);
                        }

                        while (d.value < d_max.value) {
                            ArrayPointer.assignAndIncrement(pta, d);
                        }
                    }
                    else if (SortArray.compare(swap, c, d_max.array, d_max.value - 1) > 0) {
                        while (d.value < d_max.value) {
                            ArrayPointer.assignAndIncrement(pta, d);
                        }

                        while (c.value < c_max.value) {
                            ArrayPointer.assignAndIncrement(pta, c);
                        }
                    }
                    else
                    {
                        while (d.value < d_max.value)
                        {
                            while (SortArray.compare(d.array, d, swap, c) > 0) {
                                ArrayPointer.assignAndIncrement(pta, c);
                            }

                            array.set(pta, d.array.get(d));
                            pta.add(1);
                            d.add(1);
                        }

                        while (c.value < c_max.value) {
                            ArrayPointer.assignAndIncrement(pta, c);
                        }
                    }
                }
                else
                {
                    d_max.set(pts).add(array.length - offset);

                    while (c.value < d_max.value) {
                        ArrayPointer.assignAndIncrement(pta, c);
                    }
                }
                offset += block * 4;
            }
            block *= 4;
        }

        pta.destroy();
        pts.destroy();
        c.destroy();
        c_max.destroy();
        d.destroy();
        d_max.destroy();
    };

    var swap = SortArray.create(values.length);
    quadswap(values);
    quadsort(values, swap);
    swap.destroy();
}

if (SortAlgorithms) {
    SortAlgorithms["Quadsort"] = { name: "Quadsort", sort: Quadsort };
}
