# 🚀 Implementation Guide — Novos Componentes Premium

## 1️⃣ OnboardingHint — Tutorial Elegante

### **Uso Básico:**
```tsx
import OnboardingHint from '../../src/components/OnboardingHint';

export default function MyScreen() {
    const [showHint, setShowHint] = useState(true);

    return (
        <View>
            <OnboardingHint 
                visible={showHint} 
                onDismiss={() => setShowHint(false)} 
            />
            {/* seu conteúdo */}
        </View>
    );
}
```

### **Props:**
| Prop | Tipo | Default | Descrição |
|------|------|---------|-----------|
| `visible` | boolean | true | Mostra/esconde o hint |
| `onDismiss` | () => void | undefined | Callback ao desaparecer |

### **Features:**
- ✨ Fade-in/out automático
- ✨ Gesture icons animados (👆👈)
- ✨ Auto-dismiss após 5 segundos
- ✨ Backdrop blur semi-transparente
- ✨ Sem bloquear interações

---

## 2️⃣ PremiumParticles — Partículas Flutuantes

### **Uso Básico:**
```tsx
import PremiumParticles from '../../src/components/PremiumParticles';

export default function MyScreen() {
    return (
        <View style={{ flex: 1 }}>
            <PremiumParticles count={6} color="#BC963D" />
            {/* seu conteúdo */}
        </View>
    );
}
```

### **Props:**
| Prop | Tipo | Default | Descrição |
|------|------|---------|-----------|
| `count` | number | 8 | Quantidade de partículas |
| `color` | string | '#BC963D' | Cor das partículas (rgba supported) |

### **Exemplos de Cores:**
```tsx
// Gold mystical
<PremiumParticles count={6} color="#BC963D" />

// Purple accent
<PremiumParticles count={5} color="rgba(124, 58, 237, 0.3)" />

// Silver ethereal
<PremiumParticles count={4} color="rgba(155, 163, 175, 0.2)" />
```

### **Performance:**
- ✨ Otimizado com `useNativeDriver`
- ✨ Loop eficiente sem memory leaks
- ✨ `pointerEvents="none"` — não bloqueia taps
- ✨ Ideal: 4-8 partículas por screen

---

## 3️⃣ DynamicGlow — Glow Pulsante

### **Uso Básico:**
```tsx
import DynamicGlow from '../../src/components/DynamicGlow';

export default function MyScreen() {
    return (
        <View style={{ position: 'relative' }}>
            <DynamicGlow active={true} color="#BC963D" size={150} />
            {/* seu conteúdo em cima do glow */}
        </View>
    );
}
```

### **Props:**
| Prop | Tipo | Default | Descrição |
|------|------|---------|-----------|
| `active` | boolean | true | Liga/desliga animação |
| `color` | string | Colors.gold | Cor do glow |
| `size` | number | 100 | Tamanho em pixels |

### **Casos de Uso:**
```tsx
// Para hero sections
<DynamicGlow active={true} color="rgba(188, 150, 61, 0.3)" size={300} />

// Para card highlights
<DynamicGlow active={true} color="#7C3AED" size={120} />

// Para loading states (future)
<DynamicGlow active={isLoading} color={Colors.accent} />
```

---

## 4️⃣ InteractionFeedback — Ripple Effect

### **Uso Básico:**
```tsx
import InteractionFeedback from '../../src/components/InteractionFeedback';

export default function MyComponent() {
    const [feedbacks, setFeedbacks] = useState<{x: number, y: number}[]>([]);

    const handlePress = (e: GestureResponderEvent) => {
        const { pageX, pageY } = e.nativeEvent;
        setFeedbacks([...feedbacks, { x: pageX, y: pageY }]);
    };

    return (
        <View onStartShouldSetResponder={() => true} onResponderMove={handlePress}>
            {feedbacks.map((fb, i) => (
                <InteractionFeedback
                    key={i}
                    x={fb.x}
                    y={fb.y}
                    color={Colors.gold}
                    onComplete={() => {
                        setFeedbacks(f => f.slice(1));
                    }}
                />
            ))}
        </View>
    );
}
```

### **Props:**
| Prop | Tipo | Default | Descrição |
|------|------|---------|-----------|
| `x` | number | required | Posição X do ripple |
| `y` | number | required | Posição Y do ripple |
| `color` | string | Colors.gold | Cor do ripple |
| `onComplete` | () => void | undefined | Callback ao terminar animação |

---

## 5️⃣ MysticCard com Animação

### **Uso Básico:**
```tsx
import MysticCard from '../../src/components/MysticCard';

// SEM animação (padrão)
<MysticCard>
    <Text>Conteúdo</Text>
</MysticCard>

// COM animação (novo)
<MysticCard animated={true} elevation="glow">
    <Text>Conteúdo com Pulse</Text>
</MysticCard>
```

### **Props:**
| Prop | Tipo | Default | Descrição |
|------|------|---------|-----------|
| `animated` | boolean | false | Ativa pulse animation |
| `elevation` | 'low' \| 'medium' \| 'high' \| 'glow' | 'medium' | Tipo de sombra |
| `glowColor` | 'gold' \| 'silver' \| 'purple' \| 'accent' | 'gold' | Cor do glow |
| `noPadding` | boolean | false | Remove padding interno |

### **Exemplo Completo:**
```tsx
<MysticCard 
    animated={true}
    elevation="glow" 
    glowColor="purple"
    style={{ marginBottom: 16 }}
>
    <Text style={styles.title}>Yogas & Aspectos</Text>
    <Text style={styles.text}>Descrição do yoga</Text>
</MysticCard>
```

---

## 6️⃣ Integração no TikTokNavigator

O `TikTokNavigator` agora inclui:

```tsx
// Novo: OnboardingHint automático
<OnboardingHint
    visible={showHint && !hasScrolled}
    onDismiss={() => setShowHint(false)}
/>

// Novo: PremiumParticles no background
<PremiumParticles count={6} color="rgba(188, 150, 61, 0.3)" />

// Novo: Blur dinâmico nas transições
const blur = scrollXPlanets.interpolate({
    inputRange,
    outputRange: [10, 0, 10],
    extrapolate: 'clamp'
});
```

### **Resultado:**
- ✨ Usuário vê hint na primeira vez
- ✨ Partículas flutuam no background
- ✨ Cards adjacentes têm blur dinâmico
- ✨ Auto-dismiss ao primeiro scroll

---

## 7️⃣ TikTokSection com Fade-In

Agora `TikTokSection` adiciona:

```tsx
// Fade-in automático
const [fadeAnim] = useState(new Animated.Value(0));

useEffect(() => {
    Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
    }).start();
}, []);

// Overlay gradient subtle
<LinearGradient
    colors={['transparent', 'rgba(46, 16, 101, 0.05)', 'transparent']}
    style={StyleSheet.absoluteFill}
    pointerEvents="none"
/>
```

### **Resultado:**
- ✨ Seções aparecem com fade (não abruptamente)
- ✨ Gradient overlay subtle
- ✨ Efeito de continuidade visual

---

## 8️⃣ Novos Gradientes no Theme

```typescript
// Adicionado em theme.ts
export const Gradients = {
    // ... anteriores ...
    
    // NOVO: Hero section gradient
    premiumHero: ['rgba(188, 150, 61, 0.15)', 'rgba(124, 58, 237, 0.1)', 'rgba(188, 150, 61, 0.05)']
    
    // NOVO: Cosmic background
    cosmic: ['#030308', '#0A0A1A', '#2E1065', '#0A0A1A', '#030308']
}
```

### **Uso:**
```tsx
<LinearGradient colors={Gradients.premiumHero} />
<LinearGradient colors={Gradients.cosmic} />
```

---

## 🎯 Padrão de Implementação Recomendado

### **Layout Ideal com Múltiplas Camadas:**

```tsx
export default function PremiumScreen() {
    return (
        <View style={styles.container}>
            {/* Layer 1: Base background */}
            <LinearGradient colors={Gradients.background} style={StyleSheet.absoluteFill} />
            
            {/* Layer 2: Secondary overlay */}
            <LinearGradient 
                colors={['transparent', 'rgba(46, 16, 101, 0.1)', 'transparent']}
                style={StyleSheet.absoluteFill}
            />
            
            {/* Layer 3: Radial glow centers */}
            <View style={styles.glowCenter} />
            <View style={[styles.glowCenter, styles.glowSecondary]} />
            
            {/* Layer 4: Floating particles */}
            <PremiumParticles count={6} color="rgba(188, 150, 61, 0.3)" />
            
            {/* Layer 5: Top vignette para legibilidade */}
            <LinearGradient
                colors={['rgba(3,3,8,0.9)', 'transparent']}
                style={styles.topVignette}
            />
            
            {/* Conteúdo principal */}
            <SafeAreaView style={styles.content}>
                {/* seu conteúdo */}
            </SafeAreaView>
        </View>
    );
}
```

---

## ⚡ Performance Checklist

- ✅ Usar `useNativeDriver: true` em Animated
- ✅ Usar `useCallback` para funções de animação
- ✅ Limpar animations no cleanup
- ✅ Usar `pointerEvents="none"` em overlays
- ✅ Limitar partículas a 4-8 por screen
- ✅ Usar `scrollEventThrottle={16}` em FlatLists
- ✅ Memoizar componentes pesados

---

## 🔍 Debug Tips

### **Verificar FPS:**
```
Dev Menu → Perf Monitor → Look for yellow/red
```

### **Verificar Memory:**
```
Android Studio → Profiler → Memory
Xcode → Debug → View Memory Graph
```

### **Testar Performance:**
```bash
# iOS
npm run ios -- --configuration Release

# Android
npm run android -- --variant release
```

---

## 📚 Referências

- React Native Animated: https://reactnative.dev/docs/animated
- Expo Linear Gradient: https://docs.expo.dev/versions/latest/sdk/linear-gradient/
- Design Patterns: Motion Design by Google

---

**Desenvolvido com ❤️**  
**Dúvidas? Revise DESIGN_AUDIT_&_IMPROVEMENTS.md**

