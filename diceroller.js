const diceType = document.getElementById('dice-type');
        const customDiceDiv = document.getElementById('custom-dice');
        const customDiceValue = document.getElementById('custom-dice-value');
        const numberOfRolls = document.getElementById('number-of-rolls');
        const modifier = document.getElementById('modifier');
        const advantage = document.getElementById('advantage');
        const disadvantage = document.getElementById('disadvantage');
        const rollButton = document.getElementById('roll-button');
        const resultsDiv = document.getElementById('results');
        const diceResults = document.getElementById('dice-results');
        const totalResult = document.getElementById('total-result');
        const history = document.getElementById('history');
        const clearHistoryButton = document.getElementById('clear-history');

        let isRolling = false;
        let rollHistory = [];

        diceType.addEventListener('change', () => {
            if (diceType.value === 'custom') {
                customDiceDiv.style.display = 'block';
            } else {
                customDiceDiv.style.display = 'none';
            }
        });

        advantage.addEventListener('change', () => {
            if (advantage.checked) disadvantage.checked = false;
        });

        disadvantage.addEventListener('change', () => {
            if (disadvantage.checked) advantage.checked = false;
        });

        rollButton.addEventListener('click', rollDice);
        clearHistoryButton.addEventListener('click', clearHistory);

        function rollDice() {
            if (isRolling) return;
            isRolling = true;
            rollButton.textContent = 'Rolling...';
            rollButton.disabled = true;

            const maxValue = diceType.value === 'custom' ? parseInt(customDiceValue.value) : parseInt(diceType.value.slice(1));
            const rolls = parseInt(numberOfRolls.value);
            const mod = parseInt(modifier.value);
            const hasAdvantage = advantage.checked;
            const hasDisadvantage = disadvantage.checked;

            let results = [];

            for (let i = 0; i < rolls; i++) {
                if (hasAdvantage) {
                    const roll1 = Math.floor(Math.random() * maxValue) + 1;
                    const roll2 = Math.floor(Math.random() * maxValue) + 1;
                    results.push(Math.max(roll1, roll2));
                } else if (hasDisadvantage) {
                    const roll1 = Math.floor(Math.random() * maxValue) + 1;
                    const roll2 = Math.floor(Math.random() * maxValue) + 1;
                    results.push(Math.min(roll1, roll2));
                } else {
                    results.push(Math.floor(Math.random() * maxValue) + 1);
                }
            }

            setTimeout(() => {
                displayResults(results, mod, hasDisadvantage);
                addToHistory(diceType.value === 'custom' ? `D${maxValue}` : diceType.value, results, mod, hasAdvantage, hasDisadvantage);
                isRolling = false;
                rollButton.textContent = 'Roll Dice';
                rollButton.disabled = false;
            }, 100);
        }

        function displayResults(results, mod, hasDisadvantage) {
            diceResults.innerHTML = '';
            results.forEach(result => {
                const diceResult = document.createElement('div');
                diceResult.className = 'dice-result';
                diceResult.textContent = result;
                diceResults.appendChild(diceResult);
            });

            let total = results.reduce((a, b) => a + b, 0);
            if (hasDisadvantage) {
                total -= Math.abs(mod);
                mod = -Math.abs(mod); // Garante que o modificador seja negativo para desvantagem
            } else {
                total += mod;
            }
            totalResult.textContent = `Total: ${total}${mod !== 0 ? ` (${mod > 0 ? '+' : ''}${mod})` : ''}`;
            resultsDiv.style.display = 'block';
        }

        function addToHistory(diceType, results, mod, hasAdvantage, hasDisadvantage) {
            let total = results.reduce((a, b) => a + b, 0);
            if (hasDisadvantage) {
                total -= Math.abs(mod);
                mod = -Math.abs(mod); // Garante que o modificador seja negativo para desvantagem
            } else {
                total += mod;
            }
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            historyItem.innerHTML = `
                <p>
                    ${diceType}: ${total}
                    ${mod !== 0 ? ` (${mod > 0 ? '+' : ''}${mod})` : ''}
                    ${hasAdvantage ? ' (Advantage)' : ''}
                    ${hasDisadvantage ? ' (Disadvantage)' : ''}
                </p>
            `;
            history.insertBefore(historyItem, history.firstChild);
            rollHistory.unshift({ diceType, results, mod, hasAdvantage, hasDisadvantage });
        }

        function clearHistory() {
            history.innerHTML = '';
            rollHistory = [];
        }
