package fi.oph.koulutusinformaatio;

import fi.vm.sade.properties.OphProperties;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;

@Configuration
public class UrlConfiguration extends OphProperties {

    @Autowired
    public UrlConfiguration(Environment environment) {
        addFiles("/koulutusinformaatio-ui-oph.properties");
        this.addOverride("host-oppija", environment.getRequiredProperty("host.host-oppija"));
        this.frontProperties.setProperty("koulutusinformaatio-backend.base-url", this.require("koulutusinformaatio-backend.base-url"));
        this.frontProperties.setProperty("koulutusinformaatio-backend.search", this.require("koulutusinformaatio-backend.search"));
    }
}
