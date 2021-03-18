$(document).on('submit', '.form-post', function () {
    if ($(this).attr('method') === 'post') {
        $(this).submit(function () {
            return false;
        });
        return true;
    }
});

(function ($) {

    $('[data-toggle="tooltip"]').tooltip();
    $('.sidebar').mCustomScrollbar();
    $('.sidebar .nav-sidebar li a.dropdown-toggle').removeAttr('data-toggle');

    $(document).ready(function () {

        if ($('#ckeditor').length) {
            CKEDITOR.replace('ckeditor');
        }

        $('.nav-tabs a').on('click', function () {
            if (!($(this).data('toggle') && $(this).data('toggle') == 'modal')) {
                location.href = $(this).attr('href');
            }
        });

        var hash = window.location.hash;
        if (hash.length > 0) {
            $('a[href="' + hash + '"]').tab('show')
        }

        $(document).on('click', 'button.clear', function (event) {
            event.preventDefault();
            var form = $(this).parents('form');
            form.find('input[type="text"], input[type="checkbox"]').attr('disabled', 'disabled');
            form.find('select').attr('disabled', 'disabled');
            form.find('.btn-filter').addClass('disabled');
            form.trigger('submit');
        });

        $('.calendar').next('.input-group-addon').on('click', function (event) {
            event.preventDefault();
            $(this).prev('.calendar').trigger('focus');
        });

        $(document).on('focus', '.calendar', function () {
            $(this).datetimepicker({
                format: 'dd/mm/yyyy',
                minView: 2,
                autoclose: 1,
                fontAwesome: true,
            });
        });

        $(document).on('focus', '.datetime', function () {
            $(this).datetimepicker({
                format: 'dd-mm-yyyy hh:ii',
                autoclose: 1,
                minuteStep: 10
            })
        });

        $('.filter form select, .filter form .auto').on('change', function () {
            $(this).parents('form').trigger('submit');
        });

        $('.modal-ajax').on('shown.bs.modal', function (e) {
            var button = $(e.relatedTarget);
            var href = button.attr('href');

            if (!href && e.relatedTarget.localName.toLowerCase() != 'a') {
                href = button.find('a').first().attr('href');
            }

            if (typeof href !== 'undefined') {
                var modal = $(this);
                modal.find('.modal-body').html('<div class="loading"></div>.');

                if (button.data('header')) {
                    modal.find('.modal-header h4').text(button.data('header'));
                }

                $.ajax({
                    type: 'POST',
                    url: href,
                    success: function (result) {
                        modal.find('.modal-body').html(result);
                        let select2Element = modal.find('.select2');
                        if (select2Element.length) {
                            $.each(select2Element, function (item, value) {
                                if ($(value).is('select')) {
                                    $(value).select2({
                                        placeholder: 'Please select...'
                                    });
                                }
                            })
                        }
                        modal.find('.select-all').select2({});
                        modal.find('select[name="per-page"]').select2();
                        modal.find('.tagging').select2({
                            placeholder: 'Please select...',
                            tags: true
                        });
                    }
                });
            }
        });

        $(document).on('hidden.bs.modal', '.modal', function () {
            $('.modal.in').length && $(document.body).addClass('modal-open');
        });

        $(document).on('click', '.input-group-addon', function (event) {
            event.preventDefault();
            $(this).parents('.input-group').find('input').first().focus();
        });

        if ($(window).width() < 992) {
            localStorage.setItem('sidebar-collapse', '1');
        }

        $('.sidebar-toggle').on('click', function (event) {
            event.preventDefault();
            $('body').toggleClass('collapse-sidebar');
            if ($('body').hasClass('collapse-sidebar')) {
                localStorage.setItem('sidebar-collapse', '1');
            }
            else {
                localStorage.setItem('sidebar-collapse', '0');
            }
            document.cookie = "sidebar-collapse" + "=" + localStorage.getItem('sidebar-collapse') + ";" + 365 + ";path=/";
            collapseSidebar();

        });

        $('.filter .btn-filter.dropdown-toggle').each(function () {
            var selected_label = [];

            $(this).next(".dropdown-menu").find("input[type='checkbox']:checked").each(function (index) {
                selected_label[index] = $(this).parents('label').text();
            });

            if (selected_label.length) {
                $(this).find('span.selected').text(selected_label.join(', '));
            }
        });

        $('.filter .dropdown-menu input').on('change', function () {
            var selected_label = [];

            $(this).parents(".dropdown-menu").find("input[type='checkbox']:checked").each(function (index) {
                selected_label[index] = $(this).parents('label').text();
            });

            var label = $(this).parents(".input-group").find('span.selected');
            if (selected_label.length) {
                label.text(selected_label.join(', '));
            }
            else {
                label.text('All');
            }
        });

        $(document).on('click', '.filter .dropdown-menu', function (e) {
            e.stopPropagation();
        });

        $('.sidebar li.parent > a').on('click', function (e) {
            e.preventDefault();
            $(this).next('.dropdown-menu').slideToggle();
            $(this).parent('li').toggleClass('active');
        });

        $(document).on('focus', '.time', function () {
            var defaultDate = new Date();
            var currentDate = '';
            var dataJobDate = $(this).data('date-current');
            var calendar = $('.' + dataJobDate);
            if (calendar.length && calendar.val().length) {
                defaultDate = calendar.val();
                var arrayDate = defaultDate.split('/');
                if (arrayDate[0] != undefined && arrayDate[1] != undefined && arrayDate[2] != undefined) {
                    currentDate = arrayDate[2] + '-' + arrayDate[1] + '-' + arrayDate[0];
                }
            }
            else {
                var month = defaultDate.getMonth() + 1;
                var day = defaultDate.getDate();
                currentDate = defaultDate.getFullYear() + '-' +
                    (month < 10 ? '0' : '') + month + '-' +
                    (day < 10 ? '0' : '') + day;
            }

            var startDate = currentDate + ' 00:00:00';
            var endDate = currentDate + ' 23:59:59';
            var initialDate = currentDate + ' ' + $(this).val();
            $(this).datetimepicker('remove');
            $(this).datetimepicker({
                format: 'hh:ii',
                startView: 1,
                maxView: 1,
                startDate: startDate,
                endDate: endDate,
                initialDate: initialDate,
                autoclose: 1,
                fontAwesome: true,
            })
        });
        $('.sidebar .menu-item').hover(function () {
                var selectElement = $('select');
                $.each(selectElement, function (item, value) {
                    if ($(value).hasClass("select2-hidden-accessible")) {
                        $(value).select2('close');
                    }
                })
                if ($('.mCS_destroyed').length) {
                    if ($(this).find('.dropdown-menu').length) {
                        $(this).find('.nav-link span').hide();
                    }
                }
            }, function () {
                if ($('.mCS_destroyed').length) {
                    if ($(this).find('.dropdown-menu').length) {
                        $(this).find('.nav-link span').removeAttr('style');
                    }
                }
            }
        )
    });

    $(window).resize(function () {
        collapseSidebar();
        if ($(window).width() < 992) {
            localStorage.setItem('sidebar-collapse', '1');
        }
    });

    function collapseSidebar() {
        var collapse = localStorage.getItem('sidebar-collapse');

        if (collapse == 1) {
            $('body').addClass('collapse-sidebar');
            $('.sidebar-toggle').removeClass('maximize').addClass('minimize');
            $('.sidebar').mCustomScrollbar('destroy');
        }
        else {
            $('body').removeClass('collapse-sidebar');
            $('.sidebar-toggle').removeClass('minimize').addClass('maximize');
            $('.sidebar').mCustomScrollbar();
        }
    }

    function collapseSidebarByCookie() {
        if ($('body').hasClass('collapse-sidebar')) {
            $('.sidebar-toggle').removeClass('maximize').addClass('minimize');
            $('.sidebar').mCustomScrollbar('destroy');
        }
    }

    collapseSidebarByCookie();

})(jQuery);

var loadFile = function (event) {
    var output = document.getElementById('output');
    output.src = URL.createObjectURL(event.target.files[0]);
};

function uploadFile() {
    jQuery('#upload-image').click()
}

// Render location
function initMap() {
    if ($('#map').length) {
        var dataLocation = $('#map');
        var locations = dataLocation.data('location');
        var lat = dataLocation.data('lat');
        var long = dataLocation.data('long');
        if (lat != undefined && long != undefined) {
            var center = new google.maps.LatLng(lat, long);
        }
        else {
            var center = new google.maps.LatLng();
        }
        var map = new google.maps.Map(document.getElementById('map'), {
            zoom: 10,
            center: center,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            clickableIcons: false
        });

        var icon = new google.maps.MarkerImage('../images/truck_icon.png');

        var marker, i;
        var markers = [];

        for (i = 0; i < locations.length; i++) {
            marker = new google.maps.Marker({
                position: new google.maps.LatLng(locations[i][0], locations[i][1]),
                map: map,
                icon: icon,
                optimized: false,
                address: locations[i][3],
                updatedAt: locations[i][4],
                teamName: locations[i][2]
            });

            marker.infowindow = new google.maps.InfoWindow({
                content: locations[i][2],
                pixelOffset: new google.maps.Size(70, 0),
            });
            marker.infowindowHover = new google.maps.InfoWindow({
                content: locations[i][2],
                pixelOffset: new google.maps.Size(0, 90),
            });

            google.maps.event.addListener(marker, 'mouseover', function () {
                var content = '<div class="hover-item">' + this.teamName + "<p>" + this.address + "</p>" + "<p>" + this.updatedAt + "</p></div>";
                var infowindowHover = this.infowindowHover
                infowindowHover.setContent(content);
                infowindowHover.open(map, this);
                if ($('.hover-item').length) {
                    $('.hover-item').closest('.gm-style-iw').addClass('gm-style-iw-hover');
                    $('.hover-item').closest('.gm-style-iw-t').addClass('gm-style-iw-t-hover');
                }
            });
            google.maps.event.addListener(marker, 'mouseout', function () {
                var infowindowHover = this.infowindowHover;
                infowindowHover.close();
            });
            markers.push(marker);
        }

        function AutoCenter() {
            var bounds = new google.maps.LatLngBounds();
            if (markers.length > 0) {
                $.each(markers, function (index, marker) {
                    bounds.extend(marker.position);
                });
                map.fitBounds(bounds);
            }
        }

        function showInfoWindow() {
            $.each(markers, function (index, marker) {
                marker.infowindow.open(map, marker);
            });
        }

        function hideInfoWindow() {
            $.each(markers, function (index, marker) {
                marker.infowindow.close(map, marker)
            });
        }

        $('#show-map-label').on('change', function () {
            if ($(this).is(':checked')) {
                showInfoWindow();
            }
            else {
                hideInfoWindow();
            }
        });

        AutoCenter();
    }
}