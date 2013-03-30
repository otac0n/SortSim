function OddEvenSort(values) {
    var i = values.pointer("i", 1);
    var sorted = false;
    while (!sorted) {
        sorted = true;
        for (i.set(1); i.value < values.length - 1; i.add(2)) {
            if (values.compare(i, i.value + 1) > 0) {
                values.swap(i, i.value + 1);
                sorted = false;
            }
        }
        for (i.set(0); i.value < values.length - 1; i.add(2)) {
            if (values.compare(i, i.value + 1) > 0) {
                values.swap(i, i.value + 1);
                sorted = false;
            }
        }
    }
    i.destroy();
}
