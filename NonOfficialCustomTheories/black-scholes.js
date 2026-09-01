import { ExponentialCost, FreeCost, LinearCost } from "./api/Costs";
import { BigNumber } from "./api/BigNumber";
import { theory } from "./api/Theory";
import { Utils } from "./api/Utils";
import { ui } from "./api/ui/UI";


var id = "black_scholes_spedup";
var name = "Black-Scholes Growth Model (su)";
var description = "Entry for Seasos 4.5. Ends at 1e250ρ \n Be careful to not create a Time Paradox!";
var authors = "OmarBuso\n(mod) notera";
var version = 1.1;

var tauMultiplier = 1.6;

var currency;
var q1, q2, S0, K, r, sigma;
var tVar = BigNumber.ZERO;
var dotrho = BigNumber.ZERO;

var hasWarnedTime = false;
var hasTriggeredParadox = false;
var hasNegativeRho = true;
var paradoxActivations = BigNumber.ZERO;

function init() {
    currency = theory.createCurrency();

    ///////////////////
    // Regular Upgrades
    // q1
    {
        let getDesc = (level) => "q_1=" + getQ1(level).toString(0);
        let getInfo = (level) => "q_1=" + getQ1(level).toString(0);
        q1 = theory.createUpgrade(0, currency, new FirstFreeCost(new ExponentialCost(10, 0.7)));
        q1.getDescription = (_) => Utils.getMath(getDesc(q1.level));
        q1.getInfo = (amount) => Utils.getMathTo(getInfo(q1.level), getInfo(q1.level + amount));
    }

    // q2
    {
        let getDesc = (level) => "q_2=1.25^{" + level + "}";
        let getInfo = (level) => "q_2=" + getQ2(level).toString(1);
        q2 = theory.createUpgrade(1, currency, new ExponentialCost(15, 0.8));
        q2.getDescription = (_) => Utils.getMath(getDesc(q2.level));
        q2.getInfo = (amount) => Utils.getMathTo(getInfo(q2.level), getInfo(q2.level + amount));
    }

    // S0 asset baseline
    {
        let getDesc = (level) => "S_0=" + getS0(level).toString(0);
        S0 = theory.createUpgrade(2, currency, new ExponentialCost(20, 2.05));
        S0.getDescription = (_) => Utils.getMath(getDesc(S0.level));
        S0.getInfo = (amount) => Utils.getMathTo(getDesc(S0.level), getDesc(S0.level + amount));
    }

    // K barrier
    {
        let getDesc = (level) => "K=" + getK(level).toString(0);
        K = theory.createUpgrade(3, currency, new ExponentialCost(1e100, 1.7));
        K.getDescription = (_) => Utils.getMath(getDesc(K.level));
        K.getInfo = (amount) => Utils.getMathTo(getDesc(K.level), getDesc(K.level + amount));
    }

    // r interest rate
    {
        let getDesc = (level) => "r=" + getR(level).toString(3);
        r = theory.createUpgrade(4, currency, new ExponentialCost(1e80, 1));
        r.getDescription = (_) => Utils.getMath(getDesc(r.level));
        r.getInfo = (amount) => Utils.getMathTo(getDesc(r.level), getDesc(r.level + amount));
    }

    // sigma volatility
    {
        let getDesc = (level) => "\u03C3=" + getSigma(level).toString(1);
        sigma = theory.createUpgrade(5, currency, new ExponentialCost(1e80, 1.8));
        sigma.getDescription = (_) => Utils.getMath(getDesc(sigma.level));
        sigma.getInfo = (amount) => Utils.getMathTo(getDesc(sigma.level), getDesc(sigma.level + amount));
        sigma.maxLevel = 130;
    }

    ///////////////////
    // Permanent Upgrades
    theory.createPublicationUpgrade(0, currency, 1e5);
    theory.createBuyAllUpgrade(1, currency, 1e8);
    theory.createAutoBuyerUpgrade(2, currency, 1e20);

    {
        permanent = theory.createPermanentUpgrade(3, currency, new CustomCost(level => BigNumber.from(1e250)));
        permanent.description = "Unlock the Final Chapter";
        permanent.info = "Unlocks the Final Chapter";
        permanent.boughtOrRefunded = (_) => {updateAvailability(); };
        permanent.maxLevel = 1;
        permanent.isAvailable = false;
    }

    ///////////////////
    //// Milestone Upgrades
    theory.setMilestoneCost(new CustomCost(total => BigNumber.from(getMilestoneCost(total)*tauMultiplier)));

    {
        // Look at this! Very creative names!
        milestone1 = theory.createMilestoneUpgrade(0, 1);
        milestone1.description = "Unlock $S_0$ and Normal Distribution";
        milestone1.info = "Adds the asset value $S_0$ and applies the Normal Distribution to the Main Formula";
        milestone1.boughtOrRefunded = (_) => {
            theory.invalidatePrimaryEquation();
            theory.invalidateSecondaryEquation();
            updateAvailability();
        }
        milestone1.canBeRefunded = (_) => milestone2.level == 0;
    }

    {
        milestone2 = theory.createMilestoneUpgrade(1, 1);
        milestone2.description = "Use Cumulative Normal Distribution";
        milestone2.info = "Switch to the cumulative form of the Normal Distribution";
        milestone2.boughtOrRefunded = (_) => {
            theory.invalidatePrimaryEquation();
            theory.invalidateSecondaryEquation();
            updateAvailability();
        }
        milestone2.canBeRefunded = (_) => milestone3.level == 0;
    }

    {
        milestone3 = theory.createMilestoneUpgrade(2, 1);
        milestone3.description = "Enable Call Option Formula";
        milestone3.info = "Adds the Call Option with the NormalCDF for $q_1$/$q_2$ and $q_2$/$q_1$";
        milestone3.boughtOrRefunded = (_) => {
            theory.invalidatePrimaryEquation();
            theory.invalidateTertiaryEquation();
            updateAvailability();
        }
        milestone3.canBeRefunded = (_) => milestone4.level == 0 && milestone6.level == 0;
    }

    {
        milestone4 = theory.createMilestoneUpgrade(3, 1);
        milestone4.description = "Add the Standard Probability Terms";
        milestone4.info = "Adds $d_1$ and $d_2$ to the main equation";
        milestone4.boughtOrRefunded = (_) => {
            theory.invalidatePrimaryEquation();
            updateAvailability();
        }
        milestone4.canBeRefunded = (_) => milestone5.level == 0;
    }

    {
        milestone5 = theory.createMilestoneUpgrade(4, 1);
        milestone5.description = "Unlock Strike Price K";
        milestone5.info = "Adds K, adjusting N($d_1$) and N($d_2$) to complete the Black–Scholes model";
        milestone5.boughtOrRefunded = (_) => {
            theory.invalidatePrimaryEquation();
            updateAvailability();
        }
    }

    {
        milestone6 = theory.createMilestoneUpgrade(5, 1);
        milestone6.description = "Reverse $\\dot{t}$";
        milestone6.info = "$\\dot{t} = 0.01 \\rightarrow \\dot{t} = -0.01$";
        milestone6.boughtOrRefunded = (_) => {
            theory.invalidateSecondaryEquation();
            updateAvailability();
        }
    }

    ///////////////////
    //// Story chapters
    let story1 = "Several days pass studying growth models, when you start to notice patterns, most notable, randomness seems to have its own order. \n";
    story1 += 'While organizing your notes one day, you encounter an old document called "On Pricing and Probability". \n';
    story1 += "It's a collection of partial differential equations, with terms that seem nonsensical. \n";
    story1 += "After reading for many hours, you decide to rebuild those equations. \n";
    story1 += "Hoping to understand.";
    chapter1 = theory.createStoryChapter(0, "Unknown", story1, () => q1.level > 0);

    let story2 = "Your data looks random at first, but after many, many iterations... \n";
    story2 += "A seemingly perfectly smooth curve appears, like something was affecting their randomness. \n";
    story2 += "A bell shape that seems to appear from thin air. \n";
    story2 += `"Maybe randomness isn't disorder after all", you say to yourself. \n`;
    story2 += "Maybe it's the door that connects something beautiful.";
    chapter2 = theory.createStoryChapter(1, "Patterns", story2, () => milestone1.level == 1);

    let story3 = "Distribution alone isn't enough, feeling like the curve says something. \n";
    story3 += "Each small probability, added over time, becomes something larger, a structure of inevitability. \n";
    story3 += "I shift the focus from shape to accumulation. Suddenly, everything falls into place. \n";
    story3 += "The math feels... alive now, as if learning what it means to expect the unexpected.";
    chapter3 = theory.createStoryChapter(2, "Probabilities", story3, () => milestone2.level == 1);

    let story4 = "As I push harder, the equation becomes stronger. \n";
    story4 += "Their symbols twist as if they sense my intentions. \n";
    story4 += "t grows, but also decays, and I come to understand that it's not time that's changing. \n";
    story4 += "It's me. \n\n";
    story4 += "The formula responds deliberately to each change, with numbers oscillating without any control. \n";
    story4 += "The logic has ceased to exist, while the equation... seems alive. \n";
    story4 += "I'm not solving it anymore. \n";
    story4 += "I'm part of it."; // w h a t .
    chapter4 = theory.createStoryChapter(3, "Losing", story4, () => milestone3.level == 1);

    let story5 = "The sudden noise of randomness changed into echoes. \n";
    story5 += "Events occur repeatedly, with little twists left behind. \n";
    story5 += "New terms seem to appear from nowhere. \n";
    story5 += "But thanks to them, the system remains stable. \n";
    story5 += "After some time, all of a sudden, the system becomes unstable even faster than it did earlier. \n";
    story5 += "Predictions repeat endlessly, while outcomes alter themselves. \n\n";
    story5 += "It seems as though probabilities are softly responding, adjusting my equations in languages I've never studied."; // what am i even saying :sob:
    chapter5 = theory.createStoryChapter(4, "Disorder", story5, () => milestone4.level == 1);

    let story6 = "Eventually, the model is fully assembled. \n";
    story6 += "Elegant \n";
    story6 += "Perfect \n";
    story6 += "...and yet, all calculations result in decay. \n\n";
    story6 += "Every gain becomes a loss. \n";
    story6 += "t is no longer growing. \n";
    story6 += "It's reversing. \n";
    story6 += "Like a fold in time, the graph collapses into itself, reflecting its volatility. \n";
    story6 += "I created a system to predict the future... and now, the future is wiping out the present.";  // is this a product of my own craziness?
    chapter6 = theory.createStoryChapter(5, "Colapse", story6, () => milestone5.level == 1);

    let story7 = "Time breaks. \n";
    story7 += "The equation loop endlessly. \n";
    story7 += "Every constant, every variable, slowly becoming meaningless. \n";
    story7 += "I tried fixing it, with some hope, but the damage still persist. \n";
    story7 += "Each paradox, not only does it affect my progress, but it also affects me. \n";
    story7 += "After all, was profit really the purpose of the model? \n";
    story7 += "Or was it a reflection, showing that even perfect order disintegrates..? \n";
    story7 += "I find myself in the present again, yet something feels off."; // i dont want to advance...
    chapter7 = theory.createStoryChapter(6, "Paradox", story7, () => milestone5.level == 1 && milestone6.level == 1);

    let story8 = "It happens all at once. \n";
    story8 += "Numbers still go on without any apparent sense, while the model... starts acting on its own. \n";
    story8 += "Every term forms part of something that feels alive. Evewrything feels heavier, like time itself was interfering. \n";
    story8 += "You try to make sense of it, eventually feeling a conexion, feelings, emotions, memories, everything all at once. \n";
    story8 += "And suddenly... Silence \n";
    story8 += "After so long, calm appears, the graphs stop, the values ordered. Finally, you can see the pattern, not in the formulas, but in everything behind. Growth and decay, prediction and randomness, the past, present and future, all in a perfect balance. \n";
    story8 += "It was never about profit. \n";
    story8 += "It was about understanding. \n";
    story8 += "After an exhausting analysis, you see the sense of this. \n";
    // here is the past where even I dont know how i thought of
    story8 += "Everything you followed weren't just complex ideas, they mirror the world itself... \n";
    story8 += "Every rise and fall in the function... it's just like the people, taking risks, making choices, reaching stability in chaos. The volatirity wasn't random, it was human. \n";
    story8 += "And as time goes on, whether to the future or to the past, you realize that every theory... is an attempt to understand the impossible, to explore what cannot truly be known. All this time, you haven't been calculating numbers, you have been experiencing how the world acts. \n\n";
    story8 += "Thank you for playing \n";
    story8 += "Your journey through the Black–Scholes Growth Model is complete, \n";
    story8 += "but time, as always, keeps moving forward.";
    chapter8 = theory.createStoryChapter(7, "Finale", story8, () => permanent.level == 1);

    updateAvailability();
}

var updateAvailability = () => {
    // The Great Wall of Availability^{TM}
    S0.isAvailable = milestone1.level > 0;
    K.isAvailable = milestone5.level > 0;
    r.isAvailable = milestone4.level > 0;
    sigma.isAvailable = milestone4.level > 0;

    milestone2.isAvailable = milestone1.level == 1;
    milestone3.isAvailable = milestone2.level == 1 && theory.tau >= BigNumber.from(1e50).pow(tauMultiplier);
    milestone4.isAvailable = milestone3.level == 1 && theory.tau >= BigNumber.from(1e100).pow(tauMultiplier);
    milestone5.isAvailable = milestone4.level == 1 && theory.tau >= BigNumber.from(1e150).pow(tauMultiplier);
    milestone6.isAvailable = milestone3.level == 1 && theory.tau >= BigNumber.from(1e50).pow(tauMultiplier);

    permanent.isAvailable = theory.tau > BigNumber.from(1e200).pow(tauMultiplier);
}

function normalDistribution(x) {
    // since i dont want to repeat the same thing over and over again, i'll make this simple function
    let exponent = BigNumber.from(-x * x);
    return BigNumber.E.pow(exponent);
}

function normalCdf(x) {
    // not the most accurate one but works pretty well
    fraction = -x * BigNumber.from(342) / BigNumber.from(205);
    logistic = BigNumber.from(1 + BigNumber.E.pow(fraction));
    if (milestone5.level == 1) {
        approx = getK(K.level) * getSigma(sigma.level) / logistic;
    } else {
        approx = BigNumber.ONE / logistic;
    }
    return BigNumber.from(approx);
}

function getInternalState() {
    return `${tVar} ${hasWarnedTime ? 1 : 0} ${hasTriggeredParadox ? 1 : 0} ${paradoxActivations}`;
}

function setInternalState(state) {
    let values = state.split(" ");
    if (values.length > 0) tVar = BigNumber.from(values[0]);
    if (values.length > 1) hasWarnedTime = values[1] == "1";
    if (values.length > 2) hasTriggeredParadox = values[2] == "1";
    if (values.length > 3) paradoxActivations = BigNumber.from(values[3]);
}

function tick(elapsedTime, multiplier) {
    let dt = BigNumber.from(elapsedTime * multiplier * 3600);
    let bonus = theory.publicationMultiplier;

    // Convert to variables because im too lazy to type everything again and again
    let q1Var = getQ1(q1.level);
    let q2Var = getQ2(q2.level);
    let S0Var = BigNumber.from(getS0(S0.level));
    let KVar = BigNumber.from(getK(K.level));
    let rVar = BigNumber.from(getR(r.level));
    let sigmaVar = BigNumber.from(getSigma(sigma.level));
    if (milestone6.level == 1 && q1Var > 0) {
        tVar -= BigNumber.from(0.01 * elapsedTime);
    } else if (milestone3.level == 1 && q1Var > 0) {
        tVar += BigNumber.from(0.01 * elapsedTime);
    }

    // Paradox related things
    let paradoxPenalty = BigNumber.TWO.pow(-paradoxActivations);
    if (tVar < -BigNumber.from(0.1) && !hasWarnedTime) {
        timeWarning.show();
        hasWarnedTime = true;
    }
    if (tVar < -BigNumber.from(5) && !hasTriggeredParadox) {
        paradoxWarning.show();
        hasTriggeredParadox = true;
    }
    if (currency.value < BigNumber.ZERO && hasNegativeRho) {
        negativeWarning.show();
        hasNegativeRho = false;
    }
    if (currency.value > BigNumber.ZERO && !hasNegativeRho) {
        hasNegativeRho = true;
    }

    let d1 = (BigNumber.from(S0Var / KVar).log() + (rVar + 0.5 * sigmaVar.pow(BigNumber.TWO)) * tVar) / (sigmaVar * BigNumber.from(tVar.abs() + BigNumber.ONE).sqrt()); // so much going on lol
    let d2 = d1 - sigmaVar * BigNumber.from(tVar.abs()).sqrt();
    let d1BeforeK = (BigNumber.from(S0Var).log() + (rVar * tVar)) / (tVar.abs() + BigNumber.ONE);
    let d2BeforeK = 0.1 * d1BeforeK - sigmaVar * rVar.sqrt();

    // Normal distribution things that I just cant seem to organize
    let d1Cdf = normalCdf(BigNumber.from(d1));
    let d2Cdf = normalCdf(BigNumber.from(d2));
    let d1CdfBeforeK = normalCdf(BigNumber.from(d1BeforeK));
    let d2CdfBeforeK = normalCdf(BigNumber.from(d2BeforeK));
    let q1q2RateCdf = normalCdf((q1Var - q2Var) / (q2Var));
    let q2q1RateN = normalDistribution((q2Var - q1Var) / (q1Var + 1));
    let q1q2Cdf = normalCdf(BigNumber.from(q1Var / q2Var));
    let q2q1Cdf = normalCdf(BigNumber.from(q2Var / (q1Var + BigNumber.ONE)));
    let tNormal = normalDistribution(tVar);

    // Call price, modified like a thousand times
    let discountedK = KVar * BigNumber.E.pow(tVar);
    let callPrice = S0Var * d1Cdf - discountedK * d2Cdf;
    let simplifiedCallPrice = S0Var * (d1CdfBeforeK + BigNumber.ONE).pow(sigmaVar) - d2CdfBeforeK;
    let modCallPrice = BigNumber.PI * BigNumber.TWO * S0Var * (q1q2Cdf + q2q1Cdf);
    
    dotrho = q1Var * q2Var; // Milestone 0
    if (milestone5.level == 1) dotrho *= callPrice * tNormal; // Milestone 5
    else if (milestone4.level == 1) dotrho *= simplifiedCallPrice * tNormal; // Milestone 4
    else if (milestone3.level == 1) dotrho *=  modCallPrice * tNormal; // Milestone 3
    else if (milestone2.level == 1) dotrho *= BigNumber.PI.sqrt() * (S0Var * q1q2RateCdf); // Milestone 2
    else if (milestone1.level == 1) dotrho *= S0Var * q2q1RateN; // Milestone 1

    let tickSum = bonus * dt * dotrho * paradoxPenalty;
    currency.value += tickSum;

    theory.invalidateSecondaryEquation();
    theory.invalidateTertiaryEquation();

}

var timeWarning = ui.createPopup({
    title: "Warning",
    content: ui.createStackLayout({
        children: [
            ui.createFrame({
                content: ui.createLabel({text:"Going back in time might cause a Time Paradox. Please go to the present." ,
                    padding: Thickness(12)
                })
            })
        ]
    })
});

var paradoxWarning = ui.createPopup({
    title: "Time Paradox Reached",
    content: ui.createStackLayout({
        children: [
            ui.createFrame({
                content: ui.createLabel({text: "All new gains will be divided by 2.\n Do you wish to return to the present?",
                    padding: Thickness(12)
                })
            }),
            ui.createButton({text: "Send me to the present!", onReleased: () => {
                tVar = BigNumber.ZERO;
                hasWarnedTime = false;
                hasTriggeredParadox = false;
                paradoxActivations += BigNumber.ONE;
                paradoxWarning.hide();
            }})
        ]
    })
});

var negativeWarning = ui.createPopup({
    title: "Uh oh!",
    content: ui.createStackLayout({
        children: [
            ui.createFrame({
                content: ui.createLabel({text:"Looks that you let t grow so much that now it affects negatively ρ! \n What to do: \n 1. Disable the Strike Price K milestone \n 2. Put your milestone on the Reverse t milestone \n 3. Wait \n Just remember to not create a Time Paradox in the process, the consequences are inmesurable." ,
                    padding: Thickness(12)
                })
            })
        ]
    })
});

function postPublish() {
    q1.level = 0;
    q2.level = 0;
    S0.level = 0;
    K.level = 0;
    dotrho = BigNumber.ZERO;
}

/////////////////////
// Equations

function getPrimaryEquation() {
    theory.primaryEquationScale = 1.1;
    let primary = "\\begin{matrix}";
    primary += "\\dot{\\rho} = q_1 q_2"; // Milestone 0
    if (milestone5.level == 1) {
        theory.primaryEquationHeight = 85;
        primary += "\\cdot (S_0 N(d_1)-Ke^{t} N(d_2)) \\cdot \\frac{N'(t)}{K\\sigma} \\\\\\\\ "; // Milestone 5
        primary += "d_1 = \\frac{\\ln(\\frac{S_0}{K}) + (r + \\frac{\\sigma^2}{2})t}{\\sigma \\sqrt{|t|+1}}";
        primary += "\\quad d_2 = d_1 - \\sigma \\sqrt{|t|}";
    } else if (milestone4.level == 1) {
        theory.primaryEquationHeight = 75;
        primary += "\\cdot (S_0 (N(d_1) + 1)^{\\sigma} - N(d_2)) \\cdot N'(t) \\\\\\\\ "; // Milestone 4
        primary += "d_1 = \\frac{\\ln(S_0) + rt}{|t|+1}, \\quad d_2 = \\frac{d_1}{10} - \\sigma \\sqrt{r}";
    } else if (milestone3.level == 1) {
        primary += "S_0 \\cdot (N(\\frac{q_1}{q_2}) + N(\\frac{q_2}{q_1 + 1})) \\cdot N'(t)"; // Milestone 3
    } else if (milestone2.level == 1) {
        primary += "\\cdot S_0 N(\\frac{q_1-q_2}{q_2})"; // Milestone 2
    } else if (milestone1.level == 1) {
        primary += "\\cdot S_0 N(\\frac{q_2-q_1}{q_1 + 1})"; // Milestone 1
    }
    primary += "\\end{matrix}";
    return primary;
}

function getSecondaryEquation() {
    let secondary = ""; // Milestone 0
    if (milestone1.level == 1) secondary += "N(x)= ";
    if (milestone5.level == 1) {
        theory.secondaryEquationHeight = 55;
        theory.secondaryEquationScale = 1.1;
        secondary += "\\frac{\\sigma}{\\sqrt{2\\pi}}K"; // Milestone 5
        secondary += "\\int_{-\\infty}^x e^{-\\frac{u^2}{2}}du";
    } else if (milestone4.level == 1) {
        theory.secondaryEquationHeight = 55;
        theory.secondaryEquationScale = 1.15;
        secondary += "\\frac{1}{\\sqrt{2\\pi}}"; // Milestone 4
        secondary += "\\int_{-\\infty}^x e^{-\\frac{u^2}{2}}du";
    } else if (milestone2.level == 1) {
        theory.secondaryEquationHeight = 50;
        theory.secondaryEquationScale = 1.2;
        secondary += "\\int_{-\\infty}^x e^{-u^2}du"; // Milestone 3 and 2
    } else if (milestone1.level == 1) {
        theory.secondaryEquationHeight = 25;
        theory.secondaryEquationScale = 1.3;
        secondary += "e^{-x^2}"; // Milestone 1
    }
    if (milestone3.level == 1) {
        secondary += "\\qquad \\dot{t} =";
        if (milestone6.level == 1) secondary += "-"; // Milestone 6
        secondary += "0.01";
    }

    return secondary;
}

function getTertiaryEquation() {
    let tertiary = theory.latexSymbol + "=\\max\\rho^{" + tauMultiplier + "}";
    if (milestone3.level == 1) tertiary += "\\qquad \\qquad t =" + tVar;
    return tertiary;
}

// Boring definitions

var getPublicationMultiplier = (tau) => tau.pow(0.105) / BigNumber.FIVE;
var getPublicationMultiplierFormula = (symbol) => "\\frac{{" + symbol + "}^{0.105}}{5}";
var getTau = () => (currency.value > BigNumber.ZERO ? currency.value.pow(tauMultiplier) : BigNumber.ZERO); // look at this! i had to change this because i know some people that might let t grow so much that suddenly Ke^tN(d_2) is greater than S_0N(d_1)
var getCurrencyFromTau = (tau) => [tau.max(BigNumber.ONE).pow(1/tauMultiplier), currency.symbol]
var get2DGraphValue = () => currency.value.sign * (BigNumber.ONE + currency.value.abs()).log10().toNumber();

// Useful definitions

var getQ1 = (level) => Utils.getStepwisePowerSum(level, 5, 10, 0);
var getQ2 = (level) => BigNumber.from(1.2).pow(level);
var getS0 = (level) => BigNumber.TEN * BigNumber.from(1.2).pow(level);  // baseline S0
var getK = (level) => Utils.getStepwisePowerSum(level, 3, 16, 1); // K barrier
var getR = (level) => 0.1 * Utils.getStepwisePowerSum(level, 1.1, 10, 0); // "small" interest rates
var getSigma = (level) => BigNumber.from(2 + 0.1 * level); // volatility

var getMilestoneCost = (level) => {
    switch(level) {
        case 0: return 5;
        case 1: return 20;
        case 2: return 50;
        case 3: return 55;
        case 4: return 100;
    }
    return 200;
};

init(); // i know there might be some O(n!) hiding somewhere

// currency.value += BigNumber.from(1e100)
// tVar = BigNumber.ZERO

// tau gain be like:
//            _
//         __/ \/\
//        /       \/\
// _    _|
//  \__/
