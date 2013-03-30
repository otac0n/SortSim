function HeapSort(values) {
    function siftDown(a, start, end) {
        var root = a.pointer("root", start);
        while (root.value * 2 + 1 <= end) {
            var child = a.pointer("child", root.value * 2 + 1);
            var swap = a.pointer("swap", root);
            if (a.compare(swap, child) < 0) {
                swap.set(child.value);
            }
            if (child.value + 1 <= end && a.compare(swap, child.value + 1) < 0) {
                swap.set(child.value + 1);
            }
            if (swap.value != root.value) {
                a.swap(root, swap);
                root.set(swap);
            } else {
                child.destroy();
                swap.destroy();
                root.destroy();
                return;
            }
            child.destroy();
            swap.destroy();
        }
        root.destroy();
    }

    function heapify(a, count) {
        var start = a.pointer("start", (count - 2) / 2);
        while (start.value >= 0) {
            siftDown(a, start.value, count - 1);
            start.sub(1);
        }
        start.destroy();
    }

    heapify(values, values.length);
    var end = values.pointer("end", values.length - 1);
    while (end.value > 0) {
        values.swap(end, 0);
        end.sub(1);
        siftDown(values, 0, end.value);
    }
    end.destroy();
}
