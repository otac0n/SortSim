var speed;
var stop = false;
function RenderSimple(operations) {
    var frame = 0;

    var renderOperation = function () {
        if (stop || frame >= operations.length) {
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
                div = $('<div class="array" />').attr('id', 'array' + op.id).appendTo('#field')[0];
                for (var i = 0; i < op.length; i++) {
                    $element = $('<div class="element" />').append($('<span class="value" />')).appendTo(div);
                    $element.find('.value').text(op.value ? op.value[i] : "\xB7");
                }
                break;
            case "array.set":
                $("#array" + op.id).find('.element').eq(op.index).find('.value').text(op.value === null ? "\xB7" : op.value);
                break;
            case "array.destroy":
                $("#array" + op.id).remove();
                break;
            case "array.compare":
                $("#array" + op.idA).find('.element').eq(op.indexA).css({ backgroundColor: '#fff' })
                    .animate({ backgroundColor: '#ff0' }, 400/speed, function () {
                        $(this).animate({ backgroundColor: '#fff' }, 400/speed, function () {
                            animationFinish();
                        });
                    });
                $("#array" + op.idB).find('.element').eq(op.indexB).css({ backgroundColor: '#fff' })
                    .animate({ backgroundColor: '#ff0' }, 400/speed, function () {
                        $(this).animate({ backgroundColor: '#fff' }, 400/speed, function () {
                            animationFinish();
                        });
                    });
                animations = 2;
                break;
            case "array.swap":
                var $a = $("#array" + op.idA).find('.element').eq(op.indexA).find('.value');
                var $b = $("#array" + op.idB).find('.element').eq(op.indexB).find('.value');
                var a = $b.text();
                var b = $a.text();

                if (false) {
                    $a.css({ color: '#000' })
                        .animate({ color: '#fff' }, 400/speed, function () {
                            $a.text(a);
                            $(this).animate({ color: '#000' }, 400/speed, function () {
                                animationFinish();
                            });
                        });
                    $b.css({ color: '#000' })
                        .animate({ color: '#fff' }, 400/speed, function () {
                            $b.text(b);
                            $(this).animate({ color: '#000' }, 400/speed, function () {
                                animationFinish();
                            });
                        });
                    animations = 2;
                } else {
                    $a.text(a);
                    $b.text(b);
                }

                break;
            case "pointer.create":
                $('<i />').addClass('pointer').attr('id', 'pointer' + op.id).text(op.name).appendTo($('#array' + op.array).find('.element').eq(op.value));
                break;
            case "pointer.set":
                $('#pointer' + op.id).appendTo($('#pointer' + op.id).parents('.array').find('.element').eq(op.value));
                break;
            case "pointer.destroy":
                $('#pointer' + op.id).remove();
                break;
        }

        return animations == 0;
    }

    function RenderFrame() {
        while (renderOperation()) {}
    }

    RenderFrame();
}