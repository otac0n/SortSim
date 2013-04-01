function InsertionSort(values) {
    var i = values.pointer("i", 1);
    var last = values.pointer("last", 0);
    while (i.value < values.length) {
        if (values.compare(i, i.value - 1) >= 0) {
            if (last.value != 0) {
                i.set(last);
                last.set(0);
            }
            i.add(1);
        } else {
            values.swap(i, i.value - 1);
            if (i.value > 1) {
                if (last.value == 0) {
                    last.set(i);
                }
                i.sub(1);
            } else {
                i.add(1);
            }
        }
    }
    i.destroy();
    last.destroy();
}

if (SortAlgorithms) {
    SortAlgorithms["InsertionSort"] = { name: "Insertion sort", sort: InsertionSort };
}
