var operations = [];

function ArrayPointer(name, value, array) {
    this.id = operations.length;
    this.name = name;
    this.value = value;
    this.array = array;
    operations.push({ op: "pointer.create", id: this.id, name: name, value: this.value, array: array.id });

    this.add = function add(v) {
        this.set(this.value + v);
    };

    this.sub = function add(v) {
        this.set(this.value - v);
    };

    this.set = function set(v) {
        this.value = v instanceof ArrayPointer ? v.value : v;
        operations.push({ op: "pointer.set", id: this.id, value: this.value });
    };

    this.destroy = function destroy() {
        operations.push({ op: "pointer.destroy", id: this.id });
    };
}

function SortArray(length, value) {
    this.id = operations.length;
    this.length = length;

    if (value instanceof Array) {
        this.storage = value.slice();
        this.storage.length = length;
        operations.push({ op: "array.create", id: this.id, length: length, value: this.storage.slice() });
    } else {
        operations.push({ op: "array.create", id: this.id, length: length });
        this.storage = [];
        for (var i = 0; i < this.storage.length; i++) {
            this.storage[i] = null;
        }
    }

    this.get = function get(i) {
        i = i instanceof ArrayPointer ? i.value : i;
        return this.storage[i];
    };

    this.set = function set(i, v) {
        i = i instanceof ArrayPointer ? i.value : i;
        operations.push({ op: "array.set", id: this.id, index: i, value: v });
        this.storage[i] = v;
    };

    this.compare = function compare(i, j) {
        return SortArray.compare(this, i, this, j);
    }

    this.swap = function swap(i, j) {
        SortArray.swap(this, i, this, j);
    };

    this.destroy = function destroy() {
        operations.push({ op: "array.destroy", id: this.id });
        delete this.id;
        delete this.storage;
        delete this.length;
    };

    this.pointer = function pointer(name, value) {
        return new ArrayPointer(name, value instanceof ArrayPointer ? value.value : (value || 0), this);
    }
}

SortArray.create = function (length, fill) {
    var array = [];
    array.length = length;

    for (var i = length - 1; i >= 0; i--) {
        array[i] = fill(i);
    }

    return new SortArray(array.length, array);
}

SortArray.compare = function (a, i, b, j) {
    i = i instanceof ArrayPointer ? i.value : i;
    j = j instanceof ArrayPointer ? j.value : j;
    operations.push({ op: "array.compare", idA: a.id, indexA: i, idB: b.id, indexB: j });

    return a.storage[i] > b.storage[j] ? +1
         : a.storage[i] < b.storage[j] ? -1
         : 0;
};

SortArray.swap = function (a, i, b, j) {
    i = i instanceof ArrayPointer ? i.value : i;
    j = j instanceof ArrayPointer ? j.value : j;
    operations.push({ op: "array.swap", idA: a.id, indexA: i, idB: b.id, indexB: j });

    var temp = a.storage[i];
    a.storage[i] = b.storage[j];
    b.storage[j] = temp;
};

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

function GnomeSort(values) {
    var i = values.pointer("i", 1);
    while (i.value < values.length) {
        if (values.compare(i, i.value - 1) >= 0) {
            i.add(1);
        } else {
            values.swap(i, i.value - 1);
            if (i.value > 1) {
                i.sub(1);
            }
        }
    }
    i.destroy();
}

function FastGnomeSort(values) {
    var i = values.pointer("i", 1);
    var last = values.pointer("l", 0);
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
}

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

function QuickSort(values) {
    var partition = function (array, left, right, pivotIndex) {
        left = array.pointer("left", left);
        right = array.pointer("right", right);

        var pivotArray = new SortArray(1);
        pivotArray.set(0, array.get(pivotIndex));
        array.swap(pivotIndex, right);
        var storeIndex = array.pointer("s", left);
        for (var i = array.pointer("i", left); i.value < right.value; i.add(1)) {
            if (SortArray.compare(array, i, pivotArray, 0) < 0) {
                array.swap(i, storeIndex);
                storeIndex.add(1);
            }
        }
        array.swap(storeIndex, right);

        i.destroy();
        pivotArray.destroy();
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

function MergeSort(values) {
    var merge = function (left, right) {
        var result = new SortArray(left.length + right.length);
        var o = result.pointer("o", 0);
        var l = left.pointer("l", 0);
        var r = right.pointer("r", 0);
        while (l.value < left.length || r.value < right.length) {
            if (l.value < left.length && r.value < right.length) {
                if (SortArray.compare(left, l, right, r) <= 0) {
                    result.set(o, left.get(l));
                    o.add(1);
                    l.add(1);
                } else {
                    result.set(o, right.get(r));
                    o.add(1);
                    r.add(1);
                }
            } else if (l.value < left.length) {
                result.set(o, left.get(l));
                o.add(1);
                l.add(1);
            } else if (r.value < right.length) {
                result.set(o, right.get(r));
                o.add(1);
                r.add(1);
            }
        }

        l.destroy();
        r.destroy();
        o.destroy();
        return result;
    };

    var sort = function (m) {
        if (m.length <= 1) {
            return m;
        }

        var middle = m.pointer("m", m.length / 2 | 0);
        var left = SortArray.create(middle.value, function (i) { return m.get(i); });
        var right = SortArray.create(m.length - middle.value, function (i) { return m.get(i + middle.value); })
        middle.destroy();

        left = sort(left);
        right = sort(right);

        var result = merge(left, right);
        m.destroy();
        left.destroy();
        right.destroy();
        return result;
    };

    sort(values);
}

function ShellSort(values) {
    var gaps = [701, 301, 132, 57, 23, 10, 4, 1];
    var i = values.pointer("i", 0);
    var j = values.pointer("j", 0);
    for (var g = 0; g < gaps.length; g++) {
        gap = gaps[g];
        for (i.set(gap); i.value < values.length; i.add(1)) {
            var temp = new SortArray(1);
            temp.set(0, values.get(i));
            for (j.set(i); j.value >= gap && SortArray.compare(values, j.value - gap, temp, 0) > 0; j.sub(gap)) {
                values.swap(j, j.value - gap);
            }
            values.set(j, temp.get(0));
            temp.destroy();
        }
    }
    i.destroy();
    j.destroy();
}

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
