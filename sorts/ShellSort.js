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
