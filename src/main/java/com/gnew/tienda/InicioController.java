package com.gnew.tienda;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

/** Sirve la web comercial; las solicitudes se preparan localmente en el navegador. */
@Controller
public class InicioController {
    @GetMapping({"/", "/alsha-inicio"})
    public String index() {
        return "index";
    }
}
