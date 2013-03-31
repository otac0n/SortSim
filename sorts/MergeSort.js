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

if (SortAlgorithms) {
    SortAlgorithms["MergeSort"] = { name: "Merge sort", sort: MergeSort };
}
