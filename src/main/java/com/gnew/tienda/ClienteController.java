package com.gnew.tienda;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ClienteController {

    @GetMapping("/alsha-inicio")
    public String index() {
        return "index";
    }

    @GetMapping("/contacto")
    public String mostrarContacto() {
        return "contactos/contactos";
    }

}