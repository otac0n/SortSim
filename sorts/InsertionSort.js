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

function BinarySort(values) {
    var lo = values.pointer('lo');
    var hi = values.pointer('hi');
    var pivot = values.pointer('pivot');
    var next = values.pointer('next').add(1);

    for (; next.value < values.length; next.add(1)) {
        lo.set(0);
        hi.set(next);
        do {
          pivot.set(lo).add((hi.value - lo.value) >> 1);
          if (values.compare(next, pivot) < 0) {
              hi.set(pivot);
          } else {
              lo.set(pivot).add(1);
          }
        } while(lo.value < hi.value);

        var indices = [];
        for (var p = next.value; p >= lo.value; p--) {
            indices.push(p);
        }

        values.swap.apply(values, indices);
    }

    lo.destroy();
    hi.destroy();
    pivot.destroy();
    next.destroy();
}

if (SortAlgorithms) {
    SortAlgorithms["InsertionSort"] = { name: "Insertion sort", sort: InsertionSort };
    SortAlgorithms["BinarySort"] = { name: "Binary sort", sort: BinarySort };
}
