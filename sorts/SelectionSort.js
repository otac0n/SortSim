function SelectionSort(values) {
    var i = values.pointer("i");
    var j = values.pointer("target");
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

function DoubleSelectionSort(values) {
    var i = values.pointer("i");
    var l = values.pointer("left");
    var r = values.pointer("right");
    var min = values.pointer("min");
    var max = values.pointer("max");
    for (l.set(0), r.set(values.length - 1); l.value < Math.floor(values.length / 2); l.add(1), r.sub(1)) {
        min.set(l);
        max.set(l);

        for (i.set(l.value + 1); i.value <= r.value; i.add(1)) {
            if (values.compare(i, min) < 0) {
                min.set(i);
            }
            else if (values.compare(i, max) >= 0) {
                max.set(i);
            }
        }

        if (min.value != l.value) {
            values.swap(l, min);

            if (max.value == l.value) {
                max.set(min.value);
            }
        }

        if (max.value != r.value) {
            values.swap(r, max);
        }
    }
    i.destroy();
    l.destroy();
    r.destroy();
    min.destroy();
    max.destroy();
}

if (SortAlgorithms) {
    SortAlgorithms["SelectionSort"] = { name: "Selection sort", sort: SelectionSort };
    SortAlgorithms["DoubleSelectionSort"] = { name: "Double selection sort", sort: DoubleSelectionSort };
}
