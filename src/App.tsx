import { createMemo, createSignal, type Component } from "solid-js";

const calculateurs = {
  feminine: (poids: number, taille: number, age: number) => 655 + 9.6 * poids + 1.8 * taille - 4.7 * age,
  masculine: (poids: number, taille: number, age: number) => 66 + 13.7 * poids + 5 * taille - 6.5 * age,
};
const controlGroupClass = "flex gap-4";
const controlClass = "grow grid gap-2";
const inputClass = "text-black rounded p-2 border dark:border-transparent";

const App: Component = () => {
  const [calc, setCalc] = createSignal(calculateurs.feminine);
  const [multiplicateur, setMultiplicateur] = createSignal(1.2);
  const [variables, setVariables] = createSignal<{ taille: number; poids: number; age: number }>({
    taille: NaN,
    poids: NaN,
    age: NaN,
  });

  const resultat = createMemo(() => {
    if (
      Object.values(variables()).some((v) => {
        return !v;
      })
    )
      return null;
    return (calc()(variables().poids!, variables().taille!, variables().age!) * multiplicateur()).toFixed();
  });

  return (
    <div class="flex justify-center items-center w-screen h-screen bg-neutral-200 dark:bg-neutral-800 dark:text-white text-lg">
      <div class="grid gap-8 shadow-md p-4 bg-white dark:bg-neutral-700 rounded-lg">
        <h1 class="text-2xl font-medium">Calcul de la dépense énergétique du corps</h1>
        <form class="grid gap-6">
          <div class={controlGroupClass}>
            <div class={controlClass}>
              <label for="physiologie">Physiologie</label>
              <select
                name="physiologie"
                id="physiologie"
                class={inputClass}
                onChange={(event) => {
                  setCalc(() => calculateurs[event.target.value as keyof ReturnType<typeof calc>]);
                }}
              >
                <option value="feminine" selected>
                  Feminine
                </option>
                <option value="masculine">Masculine</option>
              </select>
            </div>
            <div class={controlClass}>
              <label for="niveau_activité">Niveau d'activité</label>
              <select
                name="niveau_activité"
                id="niveau_activité"
                class={inputClass}
                onChange={(event) => {
                  setMultiplicateur(Number(event.target.value));
                }}
              >
                <option value="1.2" selected>
                  Sédentaire (inférieur à 30 minutes de marche / jour)
                </option>
                <option value="1.4">Actif (4/5h de sport par semaine)</option>
                <option value="1.6">Très actif (2h tous les jours)</option>
                <option value="1.8">Compétieur</option>
              </select>
            </div>
          </div>
          <div class={controlGroupClass}>
            <div class={controlClass}>
              <label for="age">Age</label>
              <input
                id="age"
                class={inputClass}
                type="number"
                onInput={(event) => {
                  setVariables((old) => ({ ...old, age: Number(event.target.value) }));
                }}
              />
            </div>
            <div class={controlClass}>
              <label for="taille">Taille (cm)</label>
              <input
                id="taille"
                class={inputClass}
                type="number"
                onInput={(event) => {
                  setVariables((old) => ({ ...old, taille: Number(event.target.value) }));
                }}
              />
            </div>
            <div class={controlClass}>
              <label for="poids">Poids (kg)</label>
              <input
                id="poids"
                class={inputClass}
                type="number"
                onInput={(event) => {
                  setVariables((old) => ({ ...old, poids: Number(event.target.value) }));
                }}
              />
            </div>
          </div>
        </form>
        <section class="dark:bg-neutral-100 dark:text-black rounded p-4">
          <h2 class="font-medium">Résultat</h2>
          {!resultat() ? <p>Toutes les données ne sont pas renseignées</p> : <p>{resultat()} kcal</p>}
        </section>
      </div>
    </div>
  );
};

export default App;
