function BubbleSort(values) {
    var i = values.pointer("i", 0);
    var swapped;
    do {
        swapped = false;
        for (i.set(0); i.value < values.length - 1; i.add(1)) {
            if (values.compare(i, i.value + 1) > 0) {
                values.swap(i, i.value + 1);
                swapped = true;
            }
        }
    } while (swapped);
    i.destroy();
}

function FastBubbleSort(values) {
    var n = values.pointer("n", values.length - 1);
    var i = values.pointer("i", 0);
    var swapped;
    do {
        swapped = false;
        for (i.set(0); i.value < n.value; i.add(1)) {
            if (values.compare(i, i.value + 1) > 0) {
                values.swap(i, i.value + 1);
                swapped = true;
            }
        }
        n.sub(1);
    } while (swapped);
    i.destroy();
    n.destroy();
}
