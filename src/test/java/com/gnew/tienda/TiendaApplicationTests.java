package com.gnew.tienda;

import static org.junit.jupiter.api.Assertions.*;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;

/** Verifica respuestas HTTP reales y que Maven haya incluido los recursos. */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class TiendaApplicationTests {
    @LocalServerPort
    private int port;

    private HttpResponse<String> get(String path) throws Exception {
        try (var client = HttpClient.newHttpClient()) {
            return client.send(HttpRequest.newBuilder(
                    URI.create("http://localhost:" + port + path)).GET().build(),
                    HttpResponse.BodyHandlers.ofString());
        }
    }

    @Test
    void inicioYAliasMuestranLaWebComercial() throws Exception {
        for (String path : new String[] {"/", "/alsha-inicio"}) {
            var response = get(path);
            assertEquals(200, response.statusCode());
            assertTrue(response.body().contains("Solicitar información del SaaS"));
            assertTrue(response.body().contains("id=\"solicitud-form\""));
        }
    }

    @Test
    void estilosScriptsEImagenesEstanDisponibles() throws Exception {
        for (String path : new String[] {"/css/site.css", "/js/site.js",
                "/imagenes/logo.webp", "/imagenes/facturas.webp",
                "/vendor/fontawesome/css/all.min.css"}) {
            assertEquals(200, get(path).statusCode(), path);
        }
    }
}
