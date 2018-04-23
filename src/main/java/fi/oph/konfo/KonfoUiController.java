package fi.oph.konfo;

import org.springframework.stereotype.*;
import org.springframework.web.bind.annotation.*;

@Controller
public class KonfoUiController {

    @GetMapping(value = {
            "/",
            "/haku",
            "/haku/*",
            "/koulutus",
            "/koulutus/*"})
    public String frontProperties() {
        return "/index.html";
    }
}