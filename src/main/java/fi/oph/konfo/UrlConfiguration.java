package fi.oph.konfo;

import fi.vm.sade.properties.OphProperties;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;

@Configuration
public class UrlConfiguration extends OphProperties {

    @Autowired
    public UrlConfiguration(Environment environment) {
        addFiles("/konfo-ui-oph.properties");
        this.addOverride("host-oppija", environment.getRequiredProperty("host.host-oppija"));
        this.frontProperties.setProperty("konfo-backend.base-url", this.require("konfo-backend.base-url"));
        this.frontProperties.setProperty("konfo-backend.search", this.require("konfo-backend.search"));
    }
}
