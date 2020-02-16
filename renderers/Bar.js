function RenderBar(operations, sync, target) {
    var frame = 0;
    var $parent = $('<div class="bar" />').appendTo(target);

    function getHeight(value) {
        return (+value + 1) * 2 + 'px';
    }

    var renderOperation = function () {
        if (sync.stop || frame >= operations.length) {
            return false;
        }

        var op = operations[frame++];

        var animations = 0;
        var animationFinish = function () {
            a = --animations;
            if (a == 0) {
                RenderFrame();
            }
        };

        switch (op.op) {
            case "array.create":
                $div = $('<div class="array" />').addClass('array' + op.id).appendTo($parent);
                for (var i = 0; i < op.length; i++) {
                    $('<div class="element" />').css({ height: getHeight(op.value ? op.value[i] : 0) }).data('value', op.value ? op.value[i] : null).appendTo($div);
                }
                break;
            case "array.set":
                $parent.find(".array" + op.id).find('.element').eq(op.index).css({ height: getHeight(op.value) }).data('value', op.value);
                break;
            case "array.destroy":
                $parent.find(".array" + op.id).remove();
                break;
            case "array.compare":
                $parent.find(".array" + op.idA).find('.element').eq(op.indexA).css({ backgroundColor: '#fff' })
                    .animate({ backgroundColor: '#ff0' }, 400/sync.speed, function () {
                        $(this).animate({ backgroundColor: '#fff' }, 400/sync.speed, function () {
                            animationFinish();
                        });
                    });
                $parent.find(".array" + op.idB).find('.element').eq(op.indexB).css({ backgroundColor: '#fff' })
                    .animate({ backgroundColor: '#ff0' }, 400/sync.speed, function () {
                        $(this).animate({ backgroundColor: '#fff' }, 400/sync.speed, function () {
                            animationFinish();
                        });
                    });
                animations = 2;
                break;
            case "array.swap":
                var $a = $parent.find(".array" + op.idA).find('.element').eq(op.indexA);
                var $b = $parent.find(".array" + op.idB).find('.element').eq(op.indexB);
                var a = $b.data('value');
                var b = $a.data('value');
 
                $a.css({ height: getHeight(a) }).data('value', a);
                $b.css({ height: getHeight(b) }).data('value', b);

                break;
            case "pointer.create":
                $('<span class="pointer" />').addClass('pointer' + op.id).text(op.name).appendTo($parent.find(".array" + op.array).find('.element').eq(op.value));
                break;
            case "pointer.set":
                $parent.find(".pointer" + op.id).appendTo($parent.find(".pointer" + op.id).parents('.array').find('.element').eq(op.value));
                break;
            case "pointer.destroy":
                $parent.find(".pointer" + op.id).remove();
                break;
        }

        return animations == 0;
    }

    function RenderFrame() {
        while (renderOperation()) {}
    }

    RenderFrame();
}
