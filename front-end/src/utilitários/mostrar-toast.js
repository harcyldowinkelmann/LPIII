export default function mostrarToast(referência, detalhe, tipo) {
    referência.current.show({
        severity: tipo,
        summary: tipo.charAt(0).toUpperCase() + tipo.slice(1),
        detail: detalhe,
        life: 3000
    });
}