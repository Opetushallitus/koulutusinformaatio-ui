package fi.oph.koulutusinformaatio;

import fi.vm.sade.properties.OphProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
public class UrlConfiguration extends OphProperties {

    public UrlConfiguration() {
        addFiles("/koulutusinformaatio-ui-oph.properties");
        this.frontProperties.setProperty("koulutusinformaatio-backend.base-url", this.require("koulutusinformaatio-backend.base-url"));
        this.frontProperties.setProperty("koulutusinformaatio-backend.search", this.require("koulutusinformaatio-backend.search"));
    }
}
