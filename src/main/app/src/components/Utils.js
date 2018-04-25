class Utils {
    //fi, en, sv
    static localize(obj) {
        if (obj && obj.kieli_fi) {
            return obj.kieli_fi; //Toistaiseksi palautetaan kaikelle kieleksi suomi, mutta linkitetään kaikki tätä kautta jotta kielistystoteutus on myöhemmin helppo lisätä.
        } else {
            return "Haluttua kielistystä ei löydetty";
        }
    }
}

export default Utils;