function MergeSort(values) {
    var merge = function (left, right) {
        var result = new SortArray(left.length + right.length);
        var o = result.pointer("o", 0);
        var l = left.pointer("l", 0);
        var r = right.pointer("r", 0);
        while (l.value < left.length || r.value < right.length) {
            if (l.value < left.length && r.value < right.length) {
                if (SortArray.compare(left, l, right, r) <= 0) {
                    result.set(o, left.get(l));
                    o.add(1);
                    l.add(1);
                } else {
                    result.set(o, right.get(r));
                    o.add(1);
                    r.add(1);
                }
            } else if (l.value < left.length) {
                result.set(o, left.get(l));
                o.add(1);
                l.add(1);
            } else if (r.value < right.length) {
                result.set(o, right.get(r));
                o.add(1);
                r.add(1);
            }
        }

        l.destroy();
        r.destroy();
        o.destroy();
        return result;
    };

    var sort = function (m) {
        if (m.length <= 1) {
            return m;
        }

        var middle = m.pointer("m", m.length / 2 | 0);
        var left = SortArray.create(m.storage.slice(0, middle.value));
        var right = SortArray.create(m.storage.slice(middle.value))
        middle.destroy();

        left = sort(left);
        right = sort(right);

        var result = merge(left, right);
        m.destroy();
        left.destroy();
        right.destroy();
        return result;
    };

    sort(values);
}

function BottomUpMergeSort(values) {
    var arrayA = values;
    var arrayB = SortArray.create(values.length);
    debugger;

    for (var mergeSize = 2; mergeSize / 2 <= values.length; mergeSize *= 2) {
        var l = arrayA.pointer('left');
        var r = arrayA.pointer('right');
        var i = arrayA.pointer('i');
        var j = arrayB.pointer('j');
        for (i.set(0); i.value < arrayA.length; i.add(mergeSize)) {
            l.set(i);
            r.set(i.value + mergeSize / 2);
            var lEnd = false;
            var rEnd = r.value >= arrayA.length;
            for (j.set(i); j.value < i.value + mergeSize; j.add(1)) {
                if (!lEnd && !rEnd) {
                    if (arrayA.compare(l, r) <= 0) {
                        arrayB.set(j, arrayA.get(l));
                        l.add(1);
                        lEnd = l.value > i.value + mergeSize / 2 - 1;
                    } else {
                        arrayB.set(j, arrayA.get(r));
                        r.add(1);
                        rEnd = r.value > i.value + mergeSize - 1 || r.value >= arrayA.length;
                    }
                } else if (lEnd) {
                    arrayB.set(j, arrayA.get(r));
                    r.add(1);
                } else {
                    arrayB.set(j, arrayA.get(l));
                    l.add(1);
                }
            }
        }
        j.destroy();
        i.destroy();
        r.destroy();
        l.destroy();
        var swap = arrayA;
        arrayA = arrayB;
        arrayB = swap;
    }

    if (arrayA == values) {
        arrayB.destroy();
    } else {
        for (var i = 0; i < values.length; i++) {
            values.set(i, arrayA.get(i));
        };
        arrayA.destroy();
    }
}

if (SortAlgorithms) {
    SortAlgorithms["MergeSort"] = { name: "Merge sort", sort: MergeSort };
    SortAlgorithms["BottomUpMergeSort"] = { name: "Merge sort (bottom-up)", sort: BottomUpMergeSort };
}
