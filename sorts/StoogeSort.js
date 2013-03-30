function StoogeSort(values) {
    function stoogesort(L, i, j) {
        i = L.pointer("i", i);
        j = L.pointer("j", j);
        if (L.compare(i, j) > 0) {
            L.swap(i, j);
        }
        if (j.value - i.value + 1 >= 3) {
            var t = (j.value - i.value + 1) / 3 | 0;
            stoogesort(L, i.value, j.value - t);
            stoogesort(L, i.value + t, j.value);
            stoogesort(L, i.value, j.value - t);
        }
        i.destroy();
        j.destroy();
    }

    stoogesort(values, 0, values.length - 1);
}
