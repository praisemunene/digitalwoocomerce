window.onload = function () {
    two_replace_backgrounds();
};
window.addEventListener( 'elementor/frontend/init', () => {
    elementorFrontend.hooks.addAction( 'frontend/element_ready/global', function( $scope ) {
        $scope.find("*").addClass("two_elementor_element");
        two_replace_backgrounds($scope.get( 0 ));
    } );
} );

function two_replace_backgrounds(elementor_elements = false) {
    let two_elements_list;
    if(!elementor_elements){
        two_elements_list = document.querySelectorAll("*:not(br):not(hr):not(iframe):not(pre)");
    }else{
        two_elements_list = elementor_elements.querySelectorAll(".two_elementor_element");
    }
    two_elements_list.forEach((elem) => {
        let style = elem.currentStyle || window.getComputedStyle(elem, false);

        let bg_image = style.backgroundImage;

        if (bg_image === 'none' || bg_image.indexOf(window['two_svg_placeholder']) === -1) {
            return;
        }

        bg_image = bg_image.replace(window['two_svg_placeholder'], "");
        if (!bg_image) {
            return;
        }

        elem.classList.add("two_bg");
        elem.classList.add("lazy");
        elem.classList.remove("two_elementor_element");
        elem.setAttribute("data-bg-multi", bg_image);
    });

    if (typeof two_lazyLoadInstance === "undefined") {
         window.two_lazyLoadInstance = new LazyLoad({
            'callback_applied': function(element, instance){
                let settings = instance._settings;
                var bgDataValue = element.getAttribute("data-" + settings.data_bg_multi);
                if (!bgDataValue) {
                    return;
                }

                if(window.getComputedStyle(element).getPropertyValue("background-image") !== bgDataValue) {
                    let style = element.getAttribute("style");
                    style += "background-image: " + bgDataValue + " !important;";
                    element.setAttribute("style", style);
                }
            }
        });
    } else {
        two_lazyLoadInstance.update();
    }
}

