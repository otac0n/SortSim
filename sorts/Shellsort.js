function ShellSort(values) {
    var gaps = [701, 301, 132, 57, 23, 10, 4, 1];
    var i = values.pointer("i", 0);
    var j = values.pointer("j", 0);
    for (var g = 0; g < gaps.length; g++) {
        gap = gaps[g];
        for (i.set(gap); i.value < values.length; i.add(1)) {
            for (j.set(i.value - gap); j.value >= 0 && values.compare(j, j.value + gap) > 0; j.sub(gap)) {
                values.swap(j, j.value + gap);
            }
        }
    }
    i.destroy();
    j.destroy();
}

if (SortAlgorithms) {
    SortAlgorithms["ShellSort"] = { name: "Shellsort", sort: ShellSort };
}
