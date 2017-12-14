var tot = 0;
var categories = [];
var grades = [];
var weights = [];
var ctgs;
var scats = document.getElementsByClassName("list_label_grey");
var sgrds = [];
var swts = [];
String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};
function fixhtml(elem) {
    return elem.innerHTML.replaceAll(" ","").replaceAll("%","").replaceAll("\n","");
}
var enablewei = [];
if (scats.length > 0) {
    console.log("schooloop grades detected, using to calculate")
    ctgs = scats.length;
    for (var i=0; i<scats.length; i++) {
        categories[categories.length] = fixhtml(scats[i]);
    }
    var gdsandwts = document.getElementsByClassName("list_label_grey")[0].parentNode.parentNode.getElementsByClassName("list_text");
    for (var i=0; i<gdsandwts.length; i++) {
        console.log(gdsandwts[i].offsetWidth+" "+fixhtml(gdsandwts[i]))
        if (gdsandwts[i].offsetWidth == 56) {
            var entweight = fixhtml(gdsandwts[i]);
            if (Number(entweight) == 100 || Number(entweight) == 0 || entweight == "" || entweight == " ") {
                entweight = Number(entweight)/ctgs;
                console.log("Weight 100 recieved from schoolloop, weighting equally to categories. new weight "+entweight);
            }
            if (enablegrad) {
                weights[weights.length] = Number(entweight);
            }
        } else {
            var gr = Number(fixhtml(gdsandwts[i]));
            if (gr == 0) {
                console.log("grade is 0, not using (hopefully I don't have a zero in this category actually)");
                grades[grades.length] = gr;
                enablewei.push("n");
            } else {
                grades[grades.length] = gr;
                enablewei.push("y");
            }
        }
    }
} else {
    ctgs = Number(prompt("Amnt of categories?"));
    for (var i=0; i<ctgs; i++) {
        categories[categories.length] = prompt("Name of category?");
        var entweight = Number(prompt("Weight of category in percent?"));
        if (entweight == 100) {
            entweight = entweight/ctgs;
            console.log("Weight 100 recieved, weighting equally to categories. new weight "+entweight);
        }
        weights[weights.length] = entweight;
        grades[grades.length] = Number(prompt("Grade in category?"));
    }
}

if (weights.length == 0 || weights[0] == 0 || weights[0] == "") {
    console.log("weights missing, rectifying with equal split (may be inaccurate)")
    for (var i=0; i<ctgs; i++) {
        weights[i] = 100/ctgs;
    }
}

for(var i=0; i<enablewei.length; i++) {
    if (enablewei[i] == "n") {
        weights[i] = 0;
        console.log("Setting weight at i:"+i+" to 0 because of grade 0")
    }
}

function calculate(gra,wei) {
    var total = 0;
    for (var i=0; i<ctgs; i++) {
        total+=((Number(wei[i])/100)*(Number(gra[i])/100))
    }
    return total*100;
}

var thresh = 90;
var inc = 0.5;
var dist = 0.6;
console.log("current grade: "+calculate(grades,weights))
console.log("threshold grade: "+thresh)
for (var i=0; i<ctgs; i++) {
    var c2 = JSON.parse(JSON.stringify(categories));
    var g2 = JSON.parse(JSON.stringify(grades));
    var w2 = JSON.parse(JSON.stringify(weights));
    var curgra = calculate(grades,weights);
    var found = false;
    for(var j=0; j<((curgra > 100) ? curgra/inc : 100/inc); j++) {
        var tot = calculate(g2,w2);
        //console.log("testing grade "+tot+", dist "+Math.round(Math.abs(thresh-tot))+", str "+JSON.stringify(g2))
        if ((thresh-tot) > dist) {
            g2[i]+=inc;
        } else if ((thresh-tot) < dist) {
            g2[i]-=inc;
        }
        if (Math.round(Math.abs(thresh-tot)) < (dist) && Math.round(Math.abs(thresh-tot)) > (dist) || Math.round(Math.abs(thresh-tot)) == 0 || Math.round(Math.abs(thresh-tot)) == dist) {
            console.log("min grade for category "+categories[i]+" is "+g2[i]);
            found = true;
            break;
        }
    }
    if (found == false) {
        console.log("non ideal min grade of "+g2[i]+" for category "+categories[i]+", dist "+Math.round(Math.abs(thresh-tot)));
    }
}