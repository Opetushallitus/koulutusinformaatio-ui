
const production = {
    "konfo-backend.base-url" : "/",
    "konfo-backend.search.koulutukset" : "/konfo-backend/search/koulutukset",
    "konfo-backend.search.oppilaitokset" : "/konfo-backend/search/oppilaitokset",
    "konfo-backend.koulutus" : "/konfo-backend/koulutus/",
    "konfo-backend.toteutus" : "/konfo-backend/toteutus/",
    "konfo-backend.oppilaitos" : "/konfo-backend/oppilaitos/",
    "konfo-backend.palaute" : "/konfo-backend/palaute",
    "kartta.base-url" : "https://hkp.maanmittauslaitos.fi",
    "kartta.publish-url" : "https://hkp.maanmittauslaitos.fi/hkp/published/$1/277da693-ae10-4508-bc5a-d6ced2056fd0"
};

const development = {
    "konfo-backend.base-url" : "http://localhost:" + process.env.REACT_APP_BACKEND_PORT,
    "konfo-backend.search.koulutukset" : "http://localhost:" + process.env.REACT_APP_BACKEND_PORT + "/konfo-backend/search/koulutukset",
    "konfo-backend.search.oppilaitokset" : "http://localhost:" + process.env.REACT_APP_BACKEND_PORT + "/konfo-backend/search/oppilaitokset",
    "konfo-backend.koulutus" : "http://localhost:" + process.env.REACT_APP_BACKEND_PORT + "/konfo-backend/koulutus/",
    "konfo-backend.toteutus" : "http://localhost:" + process.env.REACT_APP_BACKEND_PORT + "/konfo-backend/toteutus/",
    "konfo-backend.oppilaitos" : "http://localhost:" + process.env.REACT_APP_BACKEND_PORT + "/konfo-backend/oppilaitos/",
    "konfo-backend.palaute" : "http://localhost:" + process.env.REACT_APP_BACKEND_PORT + "/konfo-backend/palaute",
    "kartta.base-url" : "https://hkp.maanmittauslaitos.fi",
    "kartta.publish-url" : "https://hkp.maanmittauslaitos.fi/hkp/published/$1/277da693-ae10-4508-bc5a-d6ced2056fd0"
};

export {production, development}