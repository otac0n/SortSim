function CombSort(values) {
    var gap = values.length;
    var i = values.pointer("i", 0);
    var swapped = false;
    while (gap != 1 || swapped) {
        gap = (gap / 1.247330950103979) | 0;
        if (gap < 1) {
            gap = 1;
        }

        i.set(0);
        swapped = false;
        while (i.value + gap < values.length) {
            if (values.compare(i, i.value + gap) > 0) {
                values.swap(i, i.value + gap);
                swapped = true;
            }
            i.add(1);
        }
    }
    i.destroy();
}
