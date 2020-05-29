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
        this.addOverride("host-old-oppija", environment.getRequiredProperty("host.host-old-oppija"));
        this.addOverride("kartta.host", environment.getRequiredProperty("kartta.host"));
        this.addOverride("kartta.pid", environment.getRequiredProperty("kartta.pid"));
        this.addOverride("konfo-bucket", environment.getRequiredProperty("bucket.url"));
        this.frontProperties.setProperty("konfo-backend.base-url", this.require("konfo-backend.base-url"));
        this.frontProperties.setProperty("konfo-backend.old-oppija", this.require("konfo-backend.old-oppija"));
        this.frontProperties.setProperty("konfo-backend.search.koulutukset", this.require("konfo-backend.search.koulutukset"));
        this.frontProperties.setProperty("konfo-backend.koulutus", this.require("konfo-backend.koulutus"));
        this.frontProperties.setProperty("konfo-backend.search.oppilaitokset", this.require("konfo-backend.search.oppilaitokset"));
        this.frontProperties.setProperty("konfo-backend.oppilaitos", this.require("konfo-backend.oppilaitos"));
        this.frontProperties.setProperty("konfo-backend.palaute", this.require("konfo-backend.palaute"));
        this.frontProperties.setProperty("konfo-backend.content", this.require("konfo-backend.content"));
        this.frontProperties.setProperty("kartta.base-url", this.require("kartta.base-url"));
        this.frontProperties.setProperty("kartta.publish-url", this.require("kartta.publish-url"));
    }
}
