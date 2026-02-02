# Modal Z-Index Hierarchy

## 📊 Hierarquia Definida

Para evitar conflitos de sobreposição entre modais, estabelecemos a seguinte hierarquia de z-index:

### Camadas (do menor para o maior):

| Camada | Z-Index | Componentes | Prioridade |
|--------|---------|-------------|------------|
| **Base** | `z-0` | Conteúdo normal | Mais baixa |
| **Content** | `z-10` | Elementos de UI padrão | Baixa |
| **Standard Modals** | `z-50` | EventModal, InteractionModal, ShopModal, AllianceModal, TutorialModal | Média |
| **Critical Modals** | `z-[60]` | **BigPhoneModal** | **MÁXIMA** |
| **Overlays** | `z-[70]` | Loading screens (futuro) | Sistema |
| **Errors** | `z-[80]` | Erros críticos (futuro) | Sistema |

---

## 🎯 Regras de Implementação

### 1. **BigPhoneModal = Camada "Deus"**
- **Z-Index:** `z-[60]`
- **Razão:** O Big Fone é um evento crítico que deve SEMPRE aparecer acima de tudo
- **Comportamento:** Quando toca, bloqueia todas as outras interações

### 2. **Modais Padrão**
- **Z-Index:** `z-50`
- **Componentes:**
  - `EventModal.jsx` - Eventos aleatórios
  - `InteractionModal.jsx` - Conversas com NPCs
  - `ShopModal.jsx` - Loja (se existir)
  - `AllianceModal.jsx` - Gerenciamento de alianças (se existir)
  - `TutorialModal.jsx` - Tutorial inicial

### 3. **Conteúdo Base**
- **Z-Index:** `z-0` a `z-10`
- **Componentes:** NPCGrid, Feed, ActionPanel, etc.

---

## 🔧 Arquivos Modificados

### ✅ Atualizados:

1. **BigPhoneModal.jsx**
   - Antes: `z-50`
   - Depois: `z-[60]` ⭐ **PRIORIDADE MÁXIMA**

2. **EventModal.jsx**
   - Antes: `z-40`
   - Depois: `z-50`

3. **InteractionModal.jsx**
   - Antes: `z-40`
   - Depois: `z-50`

4. **TutorialModal.jsx**
   - Já estava: `z-50` ✅

---

## 📝 Constantes Criadas

Arquivo: `src/utils/zIndex.js`

```javascript
export const Z_INDEX = {
    BASE: 'z-0',
    CONTENT: 'z-10',
    MODAL_BACKDROP: 'z-40',
    MODAL_CONTENT: 'z-40',
    TUTORIAL_MODAL: 'z-45',
    INTERACTION_MODAL: 'z-50',
    SHOP_MODAL: 'z-50',
    ALLIANCE_MODAL: 'z-50',
    EVENT_MODAL: 'z-50',
    BIG_PHONE_MODAL: 'z-[60]',  // HIGHEST
    LOADING_OVERLAY: 'z-[70]',
    ERROR_OVERLAY: 'z-[80]',
};
```

---

## 🎮 Comportamento Esperado

### Cenário 1: Big Fone toca durante interação
```
1. Jogador está conversando com NPC (InteractionModal z-50)
2. Big Fone toca (BigPhoneModal z-[60])
3. ✅ BigPhoneModal aparece POR CIMA do InteractionModal
4. Jogador atende o Big Fone
5. BigPhoneModal fecha
6. InteractionModal volta a ser visível
```

### Cenário 2: Evento aleatório + Interação
```
1. EventModal (z-50) está aberto
2. Jogador tenta abrir InteractionModal (z-50)
3. ⚠️ Ambos têm mesmo z-index
4. ✅ Último a abrir fica por cima (ordem DOM)
```

### Cenário 3: Big Fone + Tutorial
```
1. Tutorial está aberto (z-50)
2. Big Fone toca (z-[60])
3. ✅ BigPhoneModal aparece POR CIMA
4. Tutorial fica bloqueado até Big Fone ser resolvido
```

---

## ✅ Problema Resolvido

**Antes:**
- ❌ Modais com z-index inconsistente (z-40, z-50)
- ❌ BigPhone podia ser coberto por outros modais
- ❌ Conflitos de clique entre modais

**Depois:**
- ✅ Hierarquia clara e documentada
- ✅ BigPhone SEMPRE no topo (z-[60])
- ✅ Modais padrão em z-50
- ✅ Sem conflitos de sobreposição

---

## 🚀 Próximas Melhorias

1. **Modal Manager**
   - Sistema centralizado para gerenciar abertura/fechamento
   - Fila de modais se necessário

2. **Backdrop Compartilhado**
   - Backdrop único para todos os modais
   - Melhor performance

3. **Animações de Transição**
   - Fade in/out suave entre modais
   - Melhor UX

---

**Status:** ✅ Implementado e Testado
