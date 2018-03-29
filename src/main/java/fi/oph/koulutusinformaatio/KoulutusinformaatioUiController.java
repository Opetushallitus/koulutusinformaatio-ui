package fi.oph.koulutusinformaatio;

import org.springframework.stereotype.*;
import org.springframework.web.bind.annotation.*;

@Controller
public class KoulutusinformaatioUiController {

    @GetMapping(value = {"/",  "/search"})
    public String frontProperties() {
        return "index.html";
    }
}