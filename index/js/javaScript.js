window.onload = function () {
    $(document).ready(function () {
        /* Declaración de variables globales ------------------------------------------------------------------------ */
        let barraProgreso = document.getElementById("relleno_barra");
        let inputParada = document.getElementById("propiedad_parada");
        let inputCota = document.getElementById("propiedad_cota");
        let arrayCotas = [1, 150, 250, 400, 500];

        let btnCota = document.getElementById("boton_cota");
        let btnParada = document.getElementById("boton_parada");
        let btnOrigen = document.getElementById("boton_origen");
        let btnReset = document.getElementById("boton_reset");

        let radioCotas = document.getElementById("r-cotas");
        let radioParadas = document.getElementById("r-paradas");

        /* ---------------------------------------------------------------------------------------------------------- */

        /* Creación y valores por defecto de los sliders ------------------------------------------------------------ */
        $("#slider_cota").slider({
            max: 500,
            min: 1,
            range: "min",
            value: 1,
            step: 1
        }).slider("pips", {
            rest: "pip"
        });
        $("#slider_parada").slider({
            max: 4,
            min: 0,
            range: "min",
            value: 0
        }).slider("pips", {
            rest: "pip"
        });
        /* ---------------------------------------------------------------------------------------------------------- */

        /* Eventos 'change' RadioButton de cotas y paradas ---------------------------------------------------------- */
        radioCotas.addEventListener("change", function () {
            console.log("Radio cotas cambia de valor");
            deshabilitar($("#slider_parada"), btnParada, inputParada);
            habilitar($("#slider_cota"), btnCota, inputCota,radioParadas);
            //todo
          //  $("#form_r_cotas").submit();
        });
        // Esto lo hace una vez para seleccionar el r-button de cotas cuando carga la página
        radioCotas.dispatchEvent(new Event("change"));

        radioParadas.addEventListener("change", function () {
            console.log("Radio paradas cambia de valor");
            deshabilitar($("#slider_cota"), btnCota, inputCota);
            habilitar($("#slider_parada"), btnParada, inputParada,radioCotas);
            //todo
          //  $("#form_r_paradas").submit();
        });
        /* ---------------------------------------------------------------------------------------------------------- */

        /* Eventos 'onclick' botones -------------------------------------------------------------------------------- */
        btnCota.addEventListener("click", function () {
            let posicion = (inputCota.value * 0.2);
            avanzarBarraProgreso(posicion);
        });

        btnParada.addEventListener("click", function () {
            let posicion = arrayCotas[inputParada.value];
            avanzarBarraProgreso(posicion * 0.2);
        });

        btnOrigen.addEventListener("click", function () {
            aOrigen();
        });

        btnReset.addEventListener("click", function () {
            aOrigen();
            let luz_error = document.getElementById("luz_error");
            luz_error.src = "multimedia/alarma-grey.png";
        });
        /* ---------------------------------------------------------------------------------------------------------- */

        /* Eventos 'input' en los input de tipo texto --------------------------------------------------------------- */
        inputCota.addEventListener("input", function () {
            let cota = inputCota.value;
            if (cota > 500) {
                inputCota.value = 500;
            } else if (cota < 1) {
                inputCota.value = "";
            } else if (isNaN(cota)) {
                inputCota.value = 1;
            }
            $("#slider_cota").slider('value', cota);
            let valorDelSliderDeCotas = $("#slider_cota").slider("value");
            calibrarSliderParada(valorDelSliderDeCotas);
        });
        inputParada.addEventListener("input", function () {
            let parada = inputParada.value;
            if (parada > 4) {
                inputParada.value = 4;
            } else if (parada < 0) {
                inputParada.value = 0;
            } else if (isNaN(parada)) {
                inputParada.value = 0;
            }
            $("#slider_parada").slider('value', parada);
            let valorDelSliderDeParadas = $("#slider_parada").slider("value");
            calibrarSliderCota(valorDelSliderDeParadas);
        });
        /* ---------------------------------------------------------------------------------------------------------- */

        /* Eventos 'keypress' en los input y slider de cotas y paradas ---------------------------------------------- */
        // Foco en cota o parada y hacer click a Enter
        $("#propiedad_cota").keypress(function (e) {
            hazClick(e, "#boton_cota");
        });
        $("#slider_cota").keypress(function (e) {
            hazClick(e, "#boton_cota");
        });
        $("#propiedad_parada").keypress(function (e) {
            hazClick(e, "#boton_parada");
        });
        $("#slider_parada").keypress(function (e) {
            hazClick(e, "#boton_parada");
        });
        /* ---------------------------------------------------------------------------------------------------------- */

        /* Eventos 'slide' cuando se mueve el slider para cambiar de valor ------------------------------------------ */
        /* SLIDERS Cuando la bola del slider se para, recogemos el valor y lo pasamos al input */
        $("#slider_cota").on("slide", function (event, ui) {
            triggerSlider(ui, inputCota, "cota");
        });
        $("#slider_parada").on("slide", function (event, ui) {
            triggerSlider(ui, inputParada, "cota");
        });
        /* ---------------------------------------------------------------------------------------------------------- */

        /* FUNCIONES ------------------------------------------------------------------------------------------------ */
        /**
         * Función que se dispara cuando se mueve el slider.
         * @param slider - El slider del que se va a sacar el valor.
         * @param input - el campo de texto que se va a actualizar cuando se mueva el slider.
         */
        function triggerSlider(slider, input) {
            let val = slider.value;
            input.value = val;

            if (input.id === "propiedad_cota") {
                calibrarSliderParada(val);
            } else {
                calibrarSliderCota(val);
            }
        }

        /**
         * Calibrar un slider cuando se hacen cambios en el otro.
         * @param slider - El slider que queremos que cambie.
         * @param valor {int} - El valor en el que lo vamos a poner, en este caso el valor determina la posición.
         * @param input - el input relacionado con el slider donde se harán los cambio.
         */
        function calibrarSlider(slider, valor, input) {
            input.value = valor;
            slider.slider({
                value: valor
            });
        }

        /**
         * Calibrar el slider de las paradas cuando el valor de las cotas coincida exactamente con el de una cota.
         * @param val {int} - El valor con el que se comprobará si la cota seleccionada es una parada
         */
        function calibrarSliderParada(val) {
            switch (val) {
                case 1:
                    calibrarSlider($("#slider_parada"), 0, inputParada);
                    break;
                case 150:
                    calibrarSlider($("#slider_parada"), 1, inputParada);
                    break;

                case 250:
                    calibrarSlider($("#slider_parada"), 2, inputParada);
                    break;

                case 400:
                    calibrarSlider($("#slider_parada"), 3, inputParada);
                    break;

                case 500:
                    calibrarSlider($("#slider_parada"), 4, inputParada);
                    break;
            }
        }

        /**
         * Calibrar el slider de las cotas cuando se seleccione una de las paradas.
         * @param val {int} - El valor que se comprobará para saber en qué cota está cada parada.
         */
        function calibrarSliderCota(val) {
            switch (val) {
                case 0:
                    calibrarSlider($("#slider_cota"), 1, inputCota);
                    break;
                case 1:
                    calibrarSlider($("#slider_cota"), 150, inputCota);
                    break;

                case 2:
                    calibrarSlider($("#slider_cota"), 250, inputCota);
                    break;

                case 3:
                    calibrarSlider($("#slider_cota"), 400, inputCota);
                    break;

                case 4:
                    calibrarSlider($("#slider_cota"), 500, inputCota);
                    break;
            }
        }

        /**
         * Reinicia todos los valores que puede cambiar el usuario y pone la barra de progreso en su posición inicial
         */
        function aOrigen() {
            inputCota.value = "";
            inputParada.value = "";
            $("#slider_cota").slider({
                value: 1
            });
            $("#slider_parada").slider({
                value: 0
            });
            avanzarBarraProgreso(0);
        }

        /**
         * Con el parametro pasado mueve la barra verde hasta la cota o parada que inserta el usuario.
         * @param posicion {int} - Valor entre 0 y 100 donde se situará el final de la barra verde.
         */
        function avanzarBarraProgreso(posicion) {
            barraProgreso.style.width = posicion + "%";
        }

        /**
         * Dispara el evento 'click' del boton que se le pase como parametro cuando pulsas 'Enter'.
         * @param tecla - Código de la tecla "Enter"
         * @param boton {string} - ID del botón.
         */
        function hazClick(tecla, boton) {
            if (tecla.keyCode == 13) {
                $(boton).trigger("click");
            }
        }

        /**
         * Habilita el slider, boton e input que se le pasen como parámetro. Cambia de color el botón a 'white'
         * @param slider
         * @param boton
         * @param input
         */
        function habilitar(slider, boton, input,rButtonElOtro) {
            input.readOnly = false;
            boton.disabled = false;
            boton.style.backgroundColor = "white";
            slider.slider('enable');
            rButtonElOtro.checked = false;
        }

        /**
         * Deshabilita el slider, boton e input que se le pasen como parámetro. Cambia de color el botón a 'E7E6E6'
         * @param slider
         * @param boton
         * @param input
         */
        function deshabilitar(slider, boton, input,rButton) {
            input.readOnly = true;
            boton.disabled = true;
            boton.style.backgroundColor = "E7E6E6";
            slider.slider('disable');
        }

        /* ---------------------------------------------------------------------------------------------------------- */
    });
};