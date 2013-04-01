function QuickSort(values) {
    var partition = function (array, left, right, pivotIndex) {
        left = array.pointer("left", left);
        right = array.pointer("right", right);

        array.swap(pivotIndex, right);
        var storeIndex = array.pointer("s", left);
        for (var i = array.pointer("i", left); i.value < right.value; i.add(1)) {
            if (array.compare(i, right) < 0) {
                array.swap(i, storeIndex);
                storeIndex.add(1);
            }
        }
        array.swap(storeIndex, right);

        i.destroy();
        right.destroy();
        left.destroy();

        r = storeIndex.value;
        storeIndex.destroy();
        return r;
    }

    var quickSort = function (array, left, right) {
        if (left < right) {
            var pivotIndex = array.pointer("p", (left + (right - left) / 2) | 0);
            var pivotNewIndex = array.pointer("n", partition(array, left, right, pivotIndex));
            pivotIndex.destroy();

            quickSort(array, left, pivotNewIndex.value - 1);
            quickSort(array, pivotNewIndex.value + 1, right);

            pivotNewIndex.destroy();
        }
    }

    quickSort(values, 0, values.length - 1);
}

if (SortAlgorithms) {
    SortAlgorithms["QuickSort"] = { name: "Quicksort", sort: QuickSort };
}
