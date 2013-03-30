function SelectionSort(values) {
    var i = values.pointer("i");
    var j = values.pointer("j");
    var iMin = values.pointer("iMin");
    for (j.set(0); j.value < values.length - 1; j.add(1)) {
        iMin.set(j);

        for (i.set(j.value + 1); i.value < values.length; i.add(1)) {
            if (values.compare(i, iMin) < 0) {
                iMin.set(i);
            }
        }

        if (iMin.value != j.value) {
            values.swap(j, iMin);
        }
    }
    i.destroy();
    j.destroy();
    iMin.destroy();
}
