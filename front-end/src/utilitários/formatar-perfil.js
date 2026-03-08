export default function formatarPerfil(perfil) {
    switch (perfil) {
        case "musico": return "Músico";
        case "maestro": return "Maestro";
        default: return "";
    }
}