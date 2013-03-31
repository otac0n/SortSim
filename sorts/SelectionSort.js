function SelectionSort(values) {
    var i = values.pointer("i");
    var j = values.pointer("j");
    var min = values.pointer("min");
    for (j.set(0); j.value < values.length - 1; j.add(1)) {
        min.set(j);

        for (i.set(j.value + 1); i.value < values.length; i.add(1)) {
            if (values.compare(i, min) < 0) {
                min.set(i);
            }
        }

        if (min.value != j.value) {
            values.swap(j, min);
        }
    }
    i.destroy();
    j.destroy();
    min.destroy();
}

if (SortAlgorithms) {
    SortAlgorithms["SelectionSort"] = { name: "Selection sort", sort: SelectionSort };
}
