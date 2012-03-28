var W = 1920;
var H = 1280;
var VPW = 960;
var VPH = 640;
var SHIFTX = (W-VPW)/2;
var SHIFTY = (H-VPH)/2;

var MERGE_URL = 'http://demo.datadealer.net/dbmerge'

var STATUS_BAR_FONT = {'font':'16px Bowlby', 'fill': '#fff','stroke':'#666','stroke-opacity':0.8};
var LABEL_FONT = {'font':'12px Bowlby', 'fill': '#010','opacity':0.5};
var DB_LABEL_FONT = {'font':'12px Bowlby', 'fill': '#010','opacity':0.5};
var BAR_NUMBER_FONT = {'font':'14px Voltaire','fill': '#FFF','stroke':'#FFF','stroke-width':0.5};
var TIMER_FONT = {'font':'11px Bowlby', 'fill': '#7F3187'};
var MONEY_FONT = {'font':'13px Bowlby', 'fill': '#5DA445','stroke':'#FFF','stroke-width':2};
var PROFILE_FONT = {'font':'13px Bowlby', 'fill': '#009FD9','stroke':'#FFF','stroke-width':2};
var CONN_IN = {'stroke':'#16A3D7','stroke-width':6,'stroke-linecap':'round'};
var CONN_OUT = {'stroke':'#E85E2B','stroke-width':6,'stroke-linecap':'round'};

var project_texts = {
  upgrades:"<span class='blue'>Bau dein Projekt aus!</span><br />Wähle zwischen verschiedenen Upgrades, um dir mehr Profile, zusätzliche Eigenschaften oder andere Vorteile zu verschaffen. Achtung: Gut ausgebaute Projekte sind auch teurer zu betreiben.",
  actions:"<span class='blue'>Werbung ist alles!</span><br />Pflastere Events mit deinen Logos zu oder kauf dir einen Promi. Neben klassischen Werbe-Kampagnen darfst du auch die Online-Welt nicht vernachlässigen. Aber Vorsicht, Werbung kostet regelmäßig!",
  team:"<span class='blue'>Stell dir dein Team zusammen!</span><br />Die Auswahl des richtigen Personals ist aufwändig und nie ganz billig. Und erst mal eingekauft wollen diese Blutsauger auch noch ein regelmäßiges Gehalt. Mühsam, aber notwendig auf deinem Weg zum Daten-Imperium."
};


var db_data = [];
var db_profileset = [
    {
        type:'vorname',
        amount: 100
    },
    {
        type:'nachname',
        amount: 100
    },
    {
        type:'adresse',
        amount: 100
    },
    {
        type:'wohnort',
        amount: 100
    },
    {
        type:'telefonnummer',
        amount: 80
    },
    {
        type:'geburtsdatum',
        amount: 90
    },
    {
        type:'geschlecht',
        amount: 90
    },
    {
        type:'email',
        amount: 50
    },
    {
        type:'personalakten',
        amount: 0.52
    },
    {
        type:'lebenslauf',
        amount: 0.52
    },
    {
        type:'besuchteschulen',
        amount: 0.52
    },
    {
        type:'einkommen',
        amount: 0.5
    },
    {
        type:'schulden',
        amount: 0.5
    },
    {
        type:'konsumgewohnheiten',
        amount: 0
    },
    {
        type:'bevorzugtecomputergames',
        amount: 0
    },
    {
        type:'gewicht',
        amount: 0
    },
    {
        type:'koerpergroesse',
        amount: 0
    },
    {
        type:'ernaehrungsweise',
        amount: 0
    },
    {
        type:'krankenakte',
        amount: 0
    },
    {
        type:'chronischekrankheiten',
        amount: 0
    },
    {
        type:'anzahldersolarienbesuche',
        amount: 0
    },
    {
        type:'alterbeimerstenmal',
        amount: 0
    },
    {
        type:'beziehungsstatus',
        amount: 0
    },
    {
        type:'sexuelleorientierung',
        amount: 0
    },

    {
        type:'partyfotos',
        amount: 0
    },
    {
        type:'iq',
        amount: 0
    },
    {
        type:'vertrauenswuerdigoderunzuverlaessig',
        amount: 0
    },
    {
        type:'zufriedenoderfrustriert',
        amount: 0
    },
    {
        type:'passwoerter',
        amount: 0
    },
    {
        type:'kreditkartennummer',
        amount: 0
    },
    {
        type:'ipadresse',
        amount: 0
    },
    {
        type:'politischeeinstellung',
        amount: 0
    },
]
var agent_data = [
  {
    x: 860,
    y: 250,
    font_attr: LABEL_FONT,
    label: 'Dr. Ernst Krasser',
    title: 'Dr. Ernst Krasser',
    subtitle:'kennt die wichtigen Leute im Staat',
    description:'Ob Politiker oder Beamte, ob in Ministerien, Behörden oder bei der Polizei: Ernst Krasser kennt sie alle. Zumindest indirekt. Immerhin hat er höchstpersönlich viele Jahre in wichtigen Positionen verbracht. Das ist zwar vorbei, trotzdem kann er immer noch jede Menge interessante Kontakte zu Leuten herstellen, die Zugriff auf ganz besonders attraktive Datenmengen haben.<br /><br />Der staatliche Verwaltungsapparat ist weitverzeigt und damit eine lukrative Quelle für allerhand persönliche Informationen, die du sonst nirgends so leicht bekommst - vor allem nicht in dieser hohen Qualität. Dr. Ernst Krasser hat noch einen Vorteil. Er ist besonders motiviert, für dich zu arbeiten. Denn du kennst zufällig ein paar - sagen wir: unangenehme - Details aus seiner Vergangenheit. Er wiederrum kennt einige unangenehme Details über...',
    data_id:'ernstkrasser',
    sprite_w: 144,
    sprite_h: 144, 
    logo: 'img/agent-krasser-logo.png',
    sprite_img: 'img/agent-krasser_s1.png',
    sprite_img_down: 'img/agent-krasser-down_s1.png',
    sprite_img_hover: 'img/agent-krasser-hover_s1.png',
    sprite_img_drag: 'img/agent-krasser-drag_s1.png',
    ready: false,
    contact_data:[
        {
            x: 680,
            y: 210,
            font_attr: LABEL_FONT,
            label: 'Sieglinde\nBayer-Wurz',
            title: 'Sieglinde Bayer-Wurz',
            description:'Sieglinde Bayer-Wurz ist Abteilungsleiterin im Bildungsministerium und hat mit dieser neu eingeführten zentralen SchülerInnendatenbank zu tun, in der seit kurzem zur "Vereinfachung der Verwaltung" jede Schul- und Universitäts-Laufbahn mit allen Einzelheiten abgespeichert wird. Sie verdient zwar nicht schlecht, aber mit dieser Innenstadt-Dachgeschosswohnung hat sie sich vielleicht doch etwas übernommen.',
            data_id:'sieglindebayerwurtz',
            logo: 'img/kontakt-sigrun-logo.png',
            sprite_w: 118,
            sprite_h: 118, 
            sprite_img: 'img/kontakt-sigrun_s1.png',
            sprite_img_down: 'img/kontakt-sigrun-down_s1.png',
            sprite_img_hover: 'img/kontakt-sigrun-hover_s1.png',
            sprite_img_drag: 'img/kontakt-sigrun-drag_s1.png',
            action_cost: 170,
            action_time: 30000,
            base_amount: 22000,
            base_risk: 1,
            tokens:[
              'vorname',
              'nachname',
              'geburtsdatum',
              'geschlecht',
              'besuchteschulen'
            ]
        },
        {
            x: 1020,
            y: 180,
            font_attr: LABEL_FONT,
            label: 'Franz Sauerzapf',
            title: 'Franz Sauerzapf',
            description:'Franz Sauerzapf ist Gerichtsvollzieher und hat es schon lange satt, jeden Tag diese schwer verschuldeten armen Schweine zu besuchen und denen auch noch Fernseher, Computer oder Auto wegzunehmen. Er ist irgendwie zynisch geworden, nennt man das Burnout? Wenn du ein paar Kröten rüberwachsen lässt, schickt er dir gerne regelmässig die Daten seiner "Kunden" - und die von ein paar Kollegen gleich dazu.',
            data_id:'franzsauerzapf',
            logo: 'img/kontakt-franzsauerzapf-logo.png',
            sprite_w: 118,
            sprite_h: 118, 
            sprite_img: 'img/kontakt-franzsauerzapf_s1.png',
            sprite_img_down: 'img/kontakt-franzsauerzapf-down_s1.png',
            sprite_img_hover: 'img/kontakt-franzsauerzapf-hover_s1.png',
            sprite_img_drag: 'img/kontakt-franzsauerzapf-drag_s1.png',
            action_cost: 200,
            action_time: 40000,
            base_amount: 30000,
            base_risk: 3,
            tokens:[
              'vorname',
              'nachname',
              'geburtsdatum',
              'geschlecht',
              'adresse',
              'wohnort',
              'schulden'
            ]
        }


    ]
  },
  {
    x: 678,
    y: 655,
    font_attr: LABEL_FONT,
    label: 'Manny Mayer',
    title: 'Manny Mayer',
    data_id:'mannymayer',
    logo:"img/agent-manni-logo.png",
    subtitle:"ist Privatdetektiv und ein alter Freund",
    description:"Vor Jahren hat er mal ein paar aufregende Kriminalfälle gelöst, prominente Zeitungsberichte abgestaubt und sich im Erfolg gesonnt wie andere im Solarium. Doch die fetten Jahre sind vorbei, inzwischen leidet Manny schwer unter Auftragsmangel. Noch dazu hat ihn ein ehemaliger Auftraggeber schwer übers Ohr gehauen. Das Ergebnis: Schlecht bezahlt, frustriert und voller Rachegelüste. Damit kennt er sich aus!<br /><br />Darum ist er inzwischen ist er ein grosser Experte im Aufstöbern von kleinen Angestellten in Ämtern oder Firmen, die vor allem eins sind: schlecht bezahlt, frustriert und voller Rachegelüste. Ha. Manche seiner Bekannten haben im Job mit ganz schön persönlichen Daten zu tun. Und haben oft vollen Zugriff darauf, brauchen sie doch für ihren Job! Gegen ein wenig Cash liefern sie dir stückchenweise leckere Happen für deine Datenbank.",
    sprite_w: 144,
    sprite_h: 144, 
    sprite_img: 'img/agent-manni_s1.png',
    sprite_img_down: 'img/agent-manni-down_s1.png',
    sprite_img_hover: 'img/agent-manni-hover_s1.png',
    sprite_img_drag: 'img/agent-manni-drag_s1.png',
    ready: false,
    //initial:true,
    contact_data : [{
            x: 826,
            y: 777,
            font_attr: LABEL_FONT,
            label: 'Schwester\nElfriede',
            title: 'Schwester Elfriede',
            data_id:'schwesterelfriede',
            logo:"img/kontakt-ks-logo.png",
            description:"Schwester Elfriede arbeitet im größten Krankenhaus des Landes. Seit 20 Jahren opfert sie sich in der Pflegestation auf. Jetzt wurde ihre Arbeitszeit verlängert und ihr Lohn gekürzt. Das findet sie gar nicht ok. Zufällig hat sie vollen Zugriff auf den Krankenhaus-Zentralcomputer, braucht das Geld und wäre bereit, uns zuverlässige Daten über den Gesundheitszustand ihrer PatientInnen zu besorgen.",
            sprite_w: 118,
            sprite_h: 118, 
            sprite_img: 'img/kontakt-ks_s1.png',
            sprite_img_down: 'img/kontakt-ks-down_s1.png',
            sprite_img_hover: 'img/kontakt-ks-hover_s1.png',
            sprite_img_drag: 'img/kontakt-ks-drag_s1.png',
            ready: true,
            action_cost: 150,
            action_time: 40000,
            base_amount: 12000,
            base_risk: 1,
            tokens:['vorname',
                    'nachname',
                    'adresse',
                    'wohnort',
                    'geburtsdatum',
                    'geschlecht',
                    'telefonnummer',
                    'gewicht',
                    'koerpergroesse',
                    'krankenakte',
                    'chronischekrankheiten'
                    ]
        },
        {
            x: 611,
            y: 826,
            font_attr: LABEL_FONT,
            label: 'Stephan Petzold',
            title: 'Stephan Petzold',
            data_id:'stephanpetzold',
            description: 'Stephan Petzold steht Tag für Tag in einer heruntergekommenen Filiale einer großen Solarien-Kette und putzt stündlich den bakterienverseuchten Schweiß von den gläsernen Strahlenkanonen. Im Theken-Computer gibt es für jeden Solarien-Junkie ein genaues Protokoll aller Besonnungen samt Dauer und Gerätetyp. Sieben Euro die Stunde, und nicht mal bezahlter Krankenstand, das ist ihm einfach zu wenig.',
            logo:"img/kontakt-solarium-logo.png",
            sprite_w: 118,
            sprite_h: 118, 
            sprite_img: 'img/kontakt-solarium_s1.png',
            sprite_img_down: 'img/kontakt-solarium-down_s1.png',
            sprite_img_hover: 'img/kontakt-solarium-hover_s1.png',
            sprite_img_drag: 'img/kontakt-solarium-drag_s1.png',
            ready: false,
            action_cost: 100,
            action_time: 30000,
            base_amount: 9000,
            base_risk: 1,
            tokens:['vorname',
                    'nachname',
                    'adresse',
                    'wohnort',
                    'geburtsdatum',
                    'geschlecht',
                    'telefonnummer',
                    'email',
                    'anzahldersolarienbesuche'
                    ]
        }
    ]
},{
    x: 508,
    y: 587,
    font_attr: LABEL_FONT,
    label: 'Mara Loft',
    title: 'Mara Loft',
    data_id:'maraloft',
    subtitle: 'kennt die Hacker-Szene wie ihre Westentasche',
    logo:"img/agent-maraloft-logo.png",
    description:"Du hast sie noch nie persönlich getroffen, du weißt nur wenig über sie.  Du hast keine Ahnung, wie du mit ihr Kontakt aufnehmen kannst. Denn, wenn, dann meldet sie sich. Via Email. Und taucht dazwischen wieder ab. Mara Loft ist ein Phantom, und doch eine deiner wertvollsten Bekanntschaften. Denn sie hat Kontakt zu dubiosen Kreisen, in denen große Pakete an äußerst delikaten Daten zu Spottpreisen angeboten werden.<br /><br />Woher die stammen, willst du eigentlich gar nicht so genau wissen. Nur eins ist klar: Anscheinend lassen sich die Datenbanken auch von großen Firmen gar nicht so gut absichern, dass nicht doch jemand einen Weg finden würde, sich reinzuhacken und einiges abzuzweigen. Ihre Quellen sind sehr vorsichtig, fast ein wenig paranoid. Aber durch schrittweise kleine Zuwendungen in Form von Cash geht da immer was.",
    sprite_w: 144,
    sprite_h: 144, 
    sprite_img: 'img/agent-generic_s1.png',
    sprite_img_down: 'img/agent-generic-down_s1.png',
    sprite_img_hover: 'img/agent-generic-hover_s1.png',
    sprite_img_drag: 'img/agent-generic-drag_s1.png',
    ready: false,
    contact_data : [{
            x: 452,
            y: 767,
            font_attr: LABEL_FONT,
            label: 'Onkel Enzo',
            title: 'Onkel Enzo',
            data_id:'onkelenzo',
            logo:"img/contact-enzo-logo.png",
            description:"Er nennt sich Onkel Enzo und behauptet, sich in das Online-Netzwerk eines globalen Spielkonsolen-Anbieters gehackt zu haben. Angeblich war das ziemlich easy. Er bietet uns nicht nur Namen und Adressen, sondern auch Passwörter, Kreditkartennummern und Game-Listen. Insgesamt hat er fast eine Million Datensätze allein aus unserem Land, da müssen wir unbedingt ran!",
            sprite_w: 118,
            sprite_h: 118, 
            sprite_img: 'img/contact-enzo_s1.png',
            sprite_img_down: 'img/contact-enzo-down_s1.png',
            sprite_img_hover: 'img/contact-enzo-hover_s1.png',
            sprite_img_drag: 'img/contact-enzo-drag_s1.png',
            ready: true,
            action_cost: 500,
            action_time: 60000,
            base_amount: 50000,
            base_risk: 5,
            tokens:['vorname',
                    'nachname',
                    'adresse',
                    'wohnort',
                    'geburtsdatum',
                    'geschlecht',
                    'telefonnummer',
                    'email',
                    'ipadresse',
                    'passwoerter',
                    'kreditkartennummer',
                    'bevorzugtecomputergames'
                    ]
        }
        
        ]
    }
]

var customer_data = [
{
    x: 1131,
    y: 842,
    font_attr: LABEL_FONT,
    label: 'Die Bahn',
    title: 'Die Bahn',
    data_id:'diebahn',
    logo:"img/customer-bahn-logo_s1.png",
    description:"Mit fast 50.000 Angestellten sind wir einer der größten Arbeitgeber des Landes. Außerdem muss unsere Personalabteilung jedes Jahr viele Tausend Bewerbungen abarbeiten - vom Lehrling bis zum Abteilungsleiter. Wir brauchen ein paar Background-Infos über unsere aktuellen und zukünftigen Angestellten, damit wir die schwarzen Schafe schnell aussortieren können.",
    sprite_w: 144,
    sprite_h: 144, 
    sprite_img: 'img/customer-bahn_s1.png',
    sprite_img_down: 'img/customer-bahn-down_s1.png',
    sprite_img_hover: 'img/customer-bahn-hover_s1.png',
    sprite_img_drag: 'img/customer-bahn-drag_s1.png',
    ready: false,
    action_AP: 2,
    action_time: 30000,
    base_income: 140,
    base_income_factor: 100,
    tokens_in:['vorname','nachname','geburtsdatum'],
    tokens_out:[
      'lebenslauf',
      'personalakten',
      'besuchteschulen',
      'vertrauenswuerdigoderunzuverlaessig',
      'zufriedenoderfrustriert',
      'iq',
      'partyfotos',
      'bevorzugtecomputergames',
      'politischeeinstellung'
    ]
},
{
    x: 972,
    y: 730,
    font_attr: LABEL_FONT,
    label: 'Kranken-\nversicherung',
    title: 'Krankenversicherung',
    data_id:'krankenversicherung',
    logo:"img/customer-versicherung-logo_s1.png",
    description:"Unsere Krankenversicherung wollen viele. Ist schon nützlich im Fall der Fälle, nicht nur für die Älteren. Aber manche Krankheiten kommen uns wirklich teuer! Bevor wir jemanden neu aufnehmen, brauchen wir unbedingt Infos über Vorerkrankungen und Risikofaktoren. Erst dann können wir entscheiden, wie teuer die Prämie wird und ob wir jemand überhaupt nehmen.",
    sprite_w: 144,
    sprite_h: 144, 
    sprite_img: 'img/customer-versicherung_s1.png',
    sprite_img_down: 'img/customer-versicherung-down_s1.png',
    sprite_img_hover: 'img/customer-versicherung-hover_s1.png',
    sprite_img_drag: 'img/customer-versicherung-drag_s1.png',
    ready: false,
    action_AP: 2,
    action_time: 45000,
    base_income: 180,
    base_income_factor: 100,
    tokens_in:['vorname','nachname','geschlecht','geburtsdatum'],
    tokens_out:[
      'gewicht',
      'koerpergroesse',
      'krankenakte',
      'chronischekrankheiten',
      'ernaehrungsweise',
      'anzahldersolarienbesuche'
    ]
},
{
    x: 1293,
    y: 787,
    font_attr: LABEL_FONT,
    label: 'Mobilfunk-\ndiscounter',
    title: 'Mobilfunkdiscounter',
    data_id:'mobilfunkdiskonter',
    logo:"img/customer-ratpull-logo_s1.png",
    description:"Bevor jemand einen Vertrag bei uns bekommt, brauchen wir ein paar Infos über Einkommen, Zahlungsmoral und so weiter. Leute, die über Ihre Verhältnisse leben oder gar Schulden haben, machen uns nur Probleme. Die nehmen wir nicht, die will keiner.",
    sprite_w: 144,
    sprite_h: 144, 
    sprite_img: 'img/customer-ratpull_s1.png',
    sprite_img_down: 'img/customer-ratpull-down_s1.png',
    sprite_img_hover: 'img/customer-ratpull-hover_s1.png',
    sprite_img_drag: 'img/customer-ratpull-drag_s1.png',
    ready: true,
    action_AP: 1,
    action_time: 20000,
    base_income: 110,
    base_income_factor: 100,
    tokens_in:['vorname','nachname','adresse','wohnort','geburtsdatum'],
    tokens_out:['einkommen','schulden','konsumgewohnheiten']
}


]

var team = {
    manager: {
        title:"Manager",
        description:"Auf Dauer kannst du nicht alles selber machen. Stell einen Manager ein, der sich um alles kümmert und deinem Team in den Arsch tritt.",
        logo:"img/team/manager_s1.png",
        logo_big:"img/team/manager-big_s1.png"
        },
    managerin: {
        title:"Managerin",
        description:"Auf Dauer kannst du nicht alles selber machen. Mit einer Frau in der Führungsetage läuft dein Team erst so richtig wie geschmiert.",
        logo:"img/team/managerin_s1.png",
        logo_big:"img/team/managerin-big_s1.png"
        },
    werbefuzzi: {
        title:"Werbe-Fuzzi",
        description:"Werbung ist alles in deinem Business. Dafür brauchst du absolute Profis, die den Leuten das Hirn weich machen, ohne dass sie es merken.",
        logo:"img/team/werbefuzzi_s1.png",
        logo_big:"img/team/werbefuzzi-big_s1.png"
        },
    werbefuzzi2: {
        title:"Werbe-Fuzzi",
        description:"Werbung ist alles in deinem Business. Dafür brauchst du absolute Profis, die den Leuten das Hirn weich machen, ohne dass sie es merken.",
        logo:"img/team/werbefuzzi2_s1.png",
        logo_big:"img/team/werbefuzzi2-big_s1.png"
        },

    student: {
        title:"Student",
        description:"Studis sind oft hoch qualifiziert, aber billig und willig. Sie lassen sich in vielen Bereichen einsetzen und verbessern deine Gesamt-Performance.",
        logo:"img/team/student_s1.png",
        logo_big:"img/team/student-big_s1.png"
        },
    studentin: {
        title:"Studentin",
        description:"Studis sind oft hoch qualifiziert, aber billig und willig. Sie lassen sich in vielen Bereichen einsetzen und verbessern deine Gesamt-Performance.",
        logo:"img/team/studentin_s1.png",
        logo_big:"img/team/studentin-big_s1.png"
        },
    psychologe: {
        title:"Psychologe",
        description:"Nicht alle Menschen geben ihre Daten ganz freiwillig her. Erkenntnisse aus der Verhaltensforschung sind hier sehr nützlich, ein wenig Manipulation schadet nie.",
        logo:"img/team/psychologe_s1.png",
        logo_big:"img/team/psychologe-big_s1.png"
        },
    anwalt: {
        title:"Anwalt",
        description:"Damit du bei deiner Profil-Sammelei auf der sicheren Seite bist, brauchst du einen guten Juristen, der deine trickreichen Formulierungen auf Herz und Nieren überprüft und kritische Stimmen in Grund und Boden klagt.",
        logo:"img/team/anwalt_s1.png",
        logo_big:"img/team/anwalt-big_s1.png"
        },
    grafiker: {
        title:"Grafiker",
        description:"Dein Projekt muss von vorne bis hinten durchgestylt sein, dann ist der Erfolg sicher. Dafür benötigst du GrafikerInnen, die wissen, was die Leute sehen wollen.",
        logo:"img/team/grafiker_s1.png",
        logo_big:"img/team/grafiker-big_s1.png"
        },
    grafikerin: {
        title:"Grafikerin",
        description:"Dein Projekt muss von vorne bis hinten durchgestylt sein, dann ist der Erfolg sicher. Dafür benötigst du GrafikerInnen, die wissen, was die Leute sehen wollen.",
        logo:"img/team/grafikerin_s1.png",
        logo_big:"img/team/grafikerin-big_s1.png"
        },
    programmierer: {
        title:"Programmierer",
        description:"Die Technik ist entscheidend im Datensammel-Business. Damit alles funktioniert und dir kein Profil verloren geht, brauchst du Programmierer, die die Maschine am Laufen halten.",
        logo:"img/team/programmierer_s1.png",
        logo_big:"img/team/programmierer-big_s1.png"
        },
    programmierer2: {
        title:"Programmierer",
        description:"Die Technik ist entscheidend im Datensammel-Business. Damit alles funktioniert und dir kein Profil verloren geht, brauchst du Programmierer, die die Maschine am Laufen halten.",
        logo:"img/team/programmierer2_s1.png",
        logo_big:"img/team/programmierer2-big_s1.png"
        },
    forscherin: {
        title:"Forscherin",
        description:"Nur mit den neuesten Technologien kannst du die Konkurrenz in die Ecke stellen. Ein Ausbau der Forschungsabteilung ist zwar teuer, macht sich langfristig aber auf jeden Fall bezahlt.",
        logo:"img/team/forscherin_s1.png",
        logo_big:"img/team/forscherin-big_s1.png"
        },
    praktikant: {
        title:"Ferialpraktikant",
        description:"FerialpraktikantInnen sind meistens nicht so fit wie Studis, haben aber einen großen Vorteil: Sie machen jeden Scheiß für dich.",
        logo:"img/team/praktikant_s1.png",
        logo_big:"img/team/praktikant-big_s1.png"
        },
    praktikantin: {
        title:"Ferialpraktikantin",
        description:"FerialpraktikantInnen sind meistens nicht so fit wie Studis, haben aber einen großen Vorteil: Sie machen jeden Scheiß für dich.",
        logo:"img/team/praktikantin_s1.png",
        logo_big:"img/team/praktikantin-big_s1.png"
        }
}

var project_data = [{
    x: 609,
    y: 412,
    font_attr: LABEL_FONT,
    label: 'Gewinnspiel',
    title: 'Gewinnspiel',
    data_id:'gewinnspiel',
    logo:"img/project-gewinnspiel-logo.png",
    description:"Setz den Leuten eine dicke, fette Karotte vor die Nase und sie wissen nicht mehr, was sie tun. Mit attraktiven Gewinnspiel-Postkarten lassen sich gut Profile scheffeln. Je geiler der Gewinn, desto mehr sind dabei!",
    sprite_w: 144,
    sprite_h: 144, 
    sprite_img: 'img/project-gewinnspiel_s1.png',
    sprite_img_down: 'img/project-gewinnspiel-down_s1.png',
    sprite_img_hover: 'img/project-gewinnspiel-hover_s1.png',
    sprite_img_drag: 'img/project-gewinnspiel-drag_s1.png',
    ready: true,
    action_cost: 10,
    action_time: 20000,
    base_amount: 100,
    base_risk: 2,
    tokens:[
            'vorname',
            'nachname',
            'adresse',
            'wohnort',
            'geburtsdatum',
            'geschlecht',
            'telefonnummer',
            'email'
            ],
    upgrades: [{
        bought:false,
        locked:false,
        id:"g1",
        title:"Logo & Design",
        logo:"img/upgrades/design_s1.png",
        logo_big:"img/upgrades/design-big_s1.png",
        description:"Die Oberfläche muss glänzen! Dein Projekt muss von vorne bis hinten durchgestylt sein, dann ist der Erfolg sicher. Je cooler die Gestaltung deines Firmen-Outfits, desto mehr Kunden kannst du ihre Daten abluchsen.",
        action_cost: 900,
        bonus_profiles:8000,
        bonus_cost: 20
      },{
        bought:true,
        locked:false,
        id:"g2",
        title:"Gewinn Eier Pott",
        logo:"img/upgrades/gewinn_s1.png",
        logo_big:"img/upgrades/gewinn-big_s1.png",
        description:"Verlose mehrere schicke Eier Potts unter den TeilnehmerInnen. Später kannst du dir vielleicht überzeugendere Gewinne leisten, aber für den Anfang reicht das auch.",
        action_cost: 1000,
        bonus_profiles:4900,
        bonus_cost: 90
      },
      {
        bought:false,
        locked:true,
        id:"g5",
        title:"Gewinn Überraschungsreise",
        logo:"img/upgrades/locked_s1.png",
        action_cost: 0
      },
      {
        bought:false,
        locked:true,
        id:"g7",
        title:"Gewinn Sportwagen",
        logo:"img/upgrades/locked_s1.png",
        action_cost: 0
      },
      {
        bought:false,
        locked:false,
        id:"g3",
        title:"Zusatzfrage Haushaltseinkommen",
        logo:"img/upgrades/zusatzfrage_s1.png",
        logo_big:"img/upgrades/zusatzfrage-big_s1.png",
        description:"Bau in deine Postkarte geschickt die Frage nach dem Haushaltseinkommen ein. Das Feld ist selbstverständlich verpflichtend auszufüllen!",
        action_cost: 2200,
        bonus_token:["einkommen"],
        bonus_risk: 2
      },
      {
        bought:false,
        locked:true,
        id:"g6",
        title:"Zusatzfrage Schulabschluss",
        logo:"img/upgrades/locked_s1.png",
        action_cost: 0,
      },
      {
        bought:false,
        locked:true,
        id:"g8",
        title:"Zusatzfrage Kinder",
        logo:"img/upgrades/locked_s1.png",
        action_cost: 0,
      },
      {
        bought:false,
        locked:false,
        id:"g4",
        title:"Privacy Policy",
        logo:"img/upgrades/privacy_s1.png",
        logo_big:"img/upgrades/privacy-big_s1.png",
        description:"Je länger, unverständlicher und vertrauenserweckender deine \"Erklärung zur Privatsphäre\" formuliert ist, desto bedenkenloser öffnen dir die Leute ihr Herz.",
        action_cost: 2800,
        bonus_profiles:17000,
        bonus_risk:-1
      }

    ],
    // gewinnspiel werbung
    actions: [
      {
        bought:false,
        locked:false,
        id:"a1",
        title:"Verteilen an U-Bahn-Stationen",
        logo:"img/actions/smallflyer_s1.png",
        logo_big:"img/actions/flyer-big_s1.png",
        description:"Engagiere ein paar hübsche, lustige und redegewandte Verkaufstalente und lass sie vor die U-Bahn-Stationen der Stadt ausschwärmen.",
        action_cost: 800,
        bonus_profiles: 11000,
        bonus_cost: 40
      },
      {
        bought:false,
        locked:false,
        id:"a2",
        title:"Verteilen in Einkaufszentren",
        logo:"img/actions/smallflyer_s1.png",
        logo_big:"img/actions/flyer-big_s1.png",
        description:"Engagiere ein paar hübsche, lustige und redegewandte Verkaufstalente und schick sie in die großen Shopping Center des Landes.",
        action_cost: 2400,
        bonus_profiles: 19000,
        bonus_cost: 60
      },
      {
        bought:false,
        locked:true,
        id:"a3",
        title:"Verteilen in Restaurants",
        logo:"img/upgrades/locked_s1.png",
        description:"",
        action_cost: 2500,
        bonus_profiles:5
      },
      {
        bought:false,
        locked:true,
        id:"a4",
        title:"Zeitungsbeilage",
        logo:"img/upgrades/locked_s1.png",
        description:"",
        action_cost: 2500,
        bonus_profiles:5
      },
      {
        bought:false,
        locked:false,
        id:"a5",
        title:"Ex-Sportler",
        logo:"img/actions/sportler_s1.png",
        logo_big:"img/actions/sportler-big_s1.png",
        description:"Kauf dir einen Promi und lass ihn für dich werben. Ex-SportlerInnen sind auf jeden Fall beliebter als Ex-PolitikerInnen und als Lieblinge der Nation besonders gut für deine Zwecke geeignet.",
        action_cost: 2800,
        bonus_profiles: 28000,
        bonus_cost: 120,
        bonus_risk: -1
      },
      {
        bought:false,
        locked:false,
        id:"a6",
        title:"Baumeister",
        logo:"img/actions/baumeister_s1.png",
        logo_big:"img/actions/baumeister-big_s1.png",
        description:"Kauf dir einen Promi und lass ihn für dich werben. Baumeister sind hierzulande eine besondere Spezialität. Achtung: nicht für jeden Zweck geeignet!",
        action_cost: 900,
        bonus_profiles: 17000,
        bonus_cost: 100,
        bonus_risk: -1
      },
      {
        bought:false,
        locked:true,
        id:"a7",
        title:"TV-Moderator",
        logo:"img/upgrades/locked_s1.png",
        description:"",
        action_cost: 2500,
        bonus_profiles:5
      },
      {
        bought:false,
        locked:false,
        id:"a8",
        title:"Bezahlte Postings",
        logo:"",
        logo_big:"",
        logo:"img/actions/online_s1.png",
        logo_big:"img/actions/online-big_s1.png",
        description:"Check dir ein paar Online-Sklaven und lass sie unter falschem Namen dein Produkt bejubeln. Eine kleine Dosis Kritik darf schon mal dabei sein, dann wirds glaubwürdiger.",
        action_cost: 800,
        bonus_profiles: 12000,
        bonus_cost: 60,
        bonus_risk: -1
      }
    ],
    team: [
      {
        bought:false,
        locked:false,
        id:"t1",
        title:team.manager.title,
        logo:team.manager.logo,
        logo_big:team.manager.logo_big,
        description:team.manager.description,
        action_cost: 600,
        bonus_profiles: 7000,
        bonus_cost: 40
      },
      {
        bought:false,
        locked:false,
        id:"t2",
        title:team.managerin.title,
        logo:team.managerin.logo,
        logo_big:team.managerin.logo_big,
        description:team.managerin.description,
        action_cost: 500,
        bonus_profiles: 8000,
        bonus_cost: 30
      },
      {
        bought:false,
        locked:false,
        id:"t3",
        title:team.werbefuzzi.title,
        logo:team.werbefuzzi.logo,
        logo_big:team.werbefuzzi.logo_big,
        description:team.werbefuzzi.description,
        action_cost: 600,
        bonus_profiles: 14000,
        bonus_cost: 70,
        bonus_risk: -1
      },
      {
        bought:false,
        locked:false,
        id:"t4",
        title:team.werbefuzzi2.title,
        logo:team.werbefuzzi2.logo,
        logo_big:team.werbefuzzi2.logo_big,
        description:team.werbefuzzi2.description,
        action_cost: 800,
        bonus_profiles: 8000,
        bonus_cost: 80
      },
      {
        bought:false,
        locked:false,
        id:"t5",
        title:team.student.title,
        logo:team.student.logo,
        logo_big:team.student.logo_big,
        description:team.student.description,
        action_cost: 90,
        bonus_profiles: 2000,
        bonus_cost: 12
      },
      {
        bought:false,
        locked:false,
        id:"t6",
        title:team.studentin.title,
        logo:team.studentin.logo,
        logo_big:team.studentin.logo_big,
        description:team.studentin.description,
        action_cost: 60,
        bonus_profiles: 3000,
        bonus_cost: 8
      },
      {
        bought:false,
        locked:false,
        id:"t7",
        title:team.psychologe.title,
        logo:team.psychologe.logo,
        logo_big:team.psychologe.logo_big,
        description:team.psychologe.description,
        action_cost: 1200,
        bonus_profiles: 18000,
        bonus_cost: 80
      },
      {
        bought:false,
        locked:false,
        id:"t8",
        title:team.anwalt.title,
        logo:team.anwalt.logo,
        logo_big:team.anwalt.logo_big,
        description:team.anwalt.description,
        action_cost: 800,
        bonus_profiles: 11000,
        bonus_cost: 60,
        bonus_risk: -1
      }
    ]
},
{
    x: 1074,
    y: 409,
    font_attr: LABEL_FONT,
    label: 'Partnerbörse',
    title: 'Partnerbörse',
    data_id:'partnerboerse',
    logo:"img/project-partnerboerse-logo.png",
    description:"Für die Aussicht auf dem Traumpartner schütten dir einsame Seelen gerne ihr Herz aus und verraten dir ihre intimsten Geheimnisse. Wenn du die Email-Adressen und Pseudonyme den richtigen Namen zuordnen kannst, wird das so richtig interessant.",
    sprite_w: 144,
    sprite_h: 144, 
    sprite_img: 'img/project-partnerboerse_s1.png',
    sprite_img_down: 'img/project-partnerboerse-down_s1.png',
    sprite_img_hover: 'img/project-partnerboerse-hover_s1.png',
    sprite_img_drag: 'img/project-partnerboerse-drag_s1.png',
    ready: false,
    action_cost: 130,
    action_time: 40000,
    base_amount: 100,
    base_risk: 3,
    tokens:[
            'geburtsdatum',
            'geschlecht',
            'telefonnummer',
            'email',
            'beziehungsstatus',
            'sexuelleorientierung',
            'alterbeimerstenmal',
            'politischeeinstellung'
        ],
    upgrades: [{
        bought:true,
        locked:false,
        id:"p1",
        title:"Logo & Design",
        logo:"img/upgrades/design_s1.png",
        logo_big:"img/upgrades/design-big_s1.png",
        description:"Dein Projekt muss von vorne bis hinten durchgestylt sein, dann ist der Erfolg sicher. Je cooler die Gestaltung deines Firmen-Outfits, desto mehr Kunden kannst du ihre Daten abluchsen. Die Oberfläche muss glänzen!",
        action_cost: 2500,
        bonus_profiles: 7900,
        bonus_cost: 20
      },{
        bought:false,
        locked:false,
        id:"p2",
        title:"Technik",
        logo:"img/upgrades/technik_s1.png",
        logo_big:"img/upgrades/technik-big_s1.png",
        description:"Damit sich deine User nicht langweilen, braucht es ein paar völlig neue Ideen und technische Spielereien.",
        action_cost: 1300,
        bonus_profiles: 9000,
        bonus_cost: 20
      },
      {
        bought:false,
        locked:true,
        id:"p3",
        title:"Fake Profile",
        logo:"img/upgrades/locked_s1.png",
        action_cost: 0
      },
      {
        bought:false,
        locked:true,
        id:"p4",
        title:"Banner Anzeigen",
        logo:"img/upgrades/locked_s1.png",
        action_cost: 0
      },
      {
        bought:false,
        locked:true,
        id:"p5",
        title:"Partner Matching Test",
        logo:"img/upgrades/locked_s1.png",
        action_cost: 0
      },
      {
        bought:false,
        locked:false,
        id:"p6",
        title:"Premium Mitgliedschaft",
        logo:"img/upgrades/premium_s1.png",
        logo_big:"img/upgrades/premium-big_s1.png",
        description:"Wenn du genügend Profile gesammelt hast, kannst du beginnen, mit Mitgliedsbeiträgen abzucashen. Außerdem kommst du durch die Zahlung zu absolut zuverlässigen Namen und Adressen.",
        action_cost: 2400,
        bonus_token:['vorname','nachname','adresse','wohnort'],
        bonus_cost: 40,
        bonus_risk: 3
      },
      {
        bought:false,
        locked:true,
        id:"p7",
        title:"Community Mods",
        logo:"img/upgrades/locked_s1.png",
        action_cost: 0
      },
      {
        bought:false,
        locked:false,
        id:"p8",
        title:"Privacy Policy",
        logo:"img/upgrades/privacy_s1.png",
        logo_big:"img/upgrades/privacy-big_s1.png",
        description:"Je länger, unverständlicher und vertrauenserweckender deine \"Erklärung zur Privatsphäre\" formuliert ist, desto bedenkenloser öffnen dir die Leute ihr Herz. ",
        action_cost: 2800,
        bonus_profiles: 17000,
        bonus_risk:-1
      }
     ],
     // partnerboerse werbung
     actions: [
       {
        bought:false,
        locked:false,
        id:"a1",
        title:"TV Spot",
        logo:"img/actions/tv-spot_s1.png",
        logo_big:"img/actions/tv-spot-big_s1.png",
        description:"Werbespots fürs Fernsehen sind nicht ganz billig zu drehen, dafür umso effektiver. Eine richtig schlechte Pointe ist dabei besonders wichtig.",
        bonus_profiles:17000,
        action_cost: 1900,
        bonus_cost: 70,
        bonus_risk: -1
      },
       {
        bought:false,
        locked:false,
        id:"a3",
        title:"Maturareise",
        logo:"img/actions/maturareise_s1.png",
        logo_big:"img/actions/maturareise-big_s1.png",
        description:"Massen-Maturareisen nach Griechenland sind kein Kindergeburtstag und darum das optimale Umfeld, um ein paar Tausend Delirium-Profile abzuschleppen.",
        bonus_profiles:5000,
        action_cost: 400,
        bonus_cost: 20,
        bonus_risk: -1
       },
       {
        bought:false,
        locked:false,
        id:"a4",
        title:"Single Party",
        logo:"img/actions/singleparty_s1.png",
        logo_big:"img/actions/singleparty-big_s1.png",
        description:"Regelmäßige Single Parties geben deinen Usern die gewisse soziale Wärme und gehören zum absoluten Pflichtprogramm für deine Partnerbörse.",
        bonus_profiles:8000,
        action_cost: 700,
        bonus_cost: 30,
        bonus_risk: -1
      },
       {
        bought:false,
        locked:true,
        id:"a2",
        title:"Rockfestival",
        logo:"img/upgrades/locked_s1.png",
        description:"",
        action_cost: 1900
      },
       {
        bought:false,
        locked:false,
        id:"a5",
        title:"Baumeister",
        logo:"img/actions/baumeister_s1.png",
        logo_big:"img/actions/baumeister-big_s1.png",
            description:"Kauf dir einen Promi und lass ihn für dich werben. Baumeister sind hierzulande eine besondere Spezialität. Achtung: nicht für jeden Zweck geeignet!",
        bonus_profiles:3000,
        action_cost: 500,
        bonus_cost: 40,
        bonus_risk: -1
      },
       {
        bought:false,
        locked:true,
        id:"a6",
        title:"TV Moderator",
        logo:"img/upgrades/locked_s1.png",
        description:"",
        action_cost: 500
      },
       {
        bought:false,
        locked:false,
        id:"a7",
        title:"Bezahlte Postings",
        logo:"img/actions/online_s1.png",
        logo_big:"img/actions/online-big_s1.png",
        description:"Check dir ein paar Online-Sklaven und lass sie unter falschem Namen dein Produkt bejubeln. Eine kleine Dosis Kritik darf schon mal dabei sein, dann wirds glaubwürdiger.",
        bonus_profiles:25000,
        action_cost: 1400,
        bonus_cost: 120,
        bonus_risk: -1
      },
       {
        bought:false,
        locked:false,
        id:"a8",
        title:"Vergleichstest",
        logo:"img/actions/online_s1.png",
        logo_big:"img/actions/online-big_s1.png",
        description:"Stell einen scheinbar unabhängigen Produkt-Vergleichstest ins Netz. Du bist dabei natürlich Sieger, wenn auch nur knapp.",
        bonus_profiles:13000,
        action_cost: 1700,
        bonus_cost: 10,
        bonus_risk: -1
      }
    ],
    team: [
      {
        bought:false,
        locked:false,
        id:"t1",
        title:team.manager.title,
        logo:team.manager.logo,
        logo_big:team.manager.logo_big,
        description:team.manager.description,
        action_cost: 600,
        bonus_profiles: 7000,
        bonus_cost: 40
      },
      {
        bought:false,
        locked:false,
        id:"t2",
        title:team.managerin.title,
        logo:team.managerin.logo,
        logo_big:team.managerin.logo_big,
        description:team.managerin.description,
        action_cost: 500,
        bonus_profiles: 8000,
        bonus_cost: 30
      },
      {
        bought:false,
        locked:false,
        id:"t3",
        title:team.grafiker.title,
        logo:team.grafiker.logo,
        logo_big:team.grafiker.logo_big,
        description:team.grafiker.description,
        action_cost: 700,
        bonus_profiles: 10000,
        bonus_cost: 60
      },
      {
        bought:false,
        locked:false,
        id:"t6",
        title:team.grafikerin.title,
        logo:team.grafikerin.logo,
        logo_big:team.grafikerin.logo_big,
        description:team.grafikerin.description,
        action_cost: 600,
        bonus_profiles: 11000,
        bonus_cost: 60
      },

      {
        bought:false,
        locked:false,
        id:"t5",
        title:team.programmierer2.title,
        logo:team.programmierer2.logo,
        logo_big:team.programmierer2.logo_big,
        description:team.programmierer2.description,
        action_cost: 500,
        bonus_profiles: 8000,
        bonus_cost: 50
      },
      {
        bought:false,
        locked:false,
        id:"t4",
        title:team.programmierer.title,
        logo:team.programmierer.logo,
        logo_big:team.programmierer.logo_big,
        description:team.programmierer.description,
        action_cost: 800,
        bonus_profiles: 12000,
        bonus_cost: 70
      },
      {
        bought:false,
        locked:false,
        id:"t7",
        title:team.psychologe.title,
        logo:team.psychologe.logo,
        logo_big:team.psychologe.logo_big,
        description:team.psychologe.description,
        action_cost: 1200,
        bonus_profiles: 18000,
        bonus_cost: 80
      },
      {
        bought:false,
        locked:false,
        id:"t8",
        title:team.anwalt.title,
        logo:team.anwalt.logo,
        logo_big:team.anwalt.logo_big,
        description:team.anwalt.description,
        action_cost: 800,
        bonus_profiles: 11000,
        bonus_cost: 60,
        bonus_risk: -1
      }
    ]
},
{
    x: 1175,
    y: 599,
    font_attr: LABEL_FONT,
    label: 'Psychotest',
    title: 'Psychotest',
    data_id:'psychotest',
    description:"Auf Online-Psychotests stehen sie alle. Damit lassen sich detaillierte Charakterprofile erstellen. Die ausführliche Premium-Auswertung für den mühsam aufgefüllten Test gibts am Ende natürlich nur gegen Angabe von ein paar Eckdaten zur Person.",
    sprite_w: 144,
    sprite_h: 144,
    sprite_img: 'img/project-psychotest_s1.png',
    sprite_img_down: 'img/project-psychotest-down_s1.png',
    sprite_img_hover: 'img/project-psychotest-hover_s1.png',
    sprite_img_drag: 'img/project-psychotest-drag_s1.png',
    logo:"img/project-psychotest-logo.png",
    ready: true,
    action_cost: 130,
    action_time: 30000,
    base_amount: 2000,
    base_risk: 1,
    tokens:[
            'ipadresse',
            'geburtsdatum',
            'geschlecht'
            ],
    upgrades: [{
        bought:false,
        locked:false,
        id:"p1",
        title:"Logo & Design",
        logo:"img/upgrades/design_s1.png",
        logo_big:"img/upgrades/design-big_s1.png",
        description:"Dein Projekt muss von vorne bis hinten durchgestylt sein, dann ist der Erfolg sicher. Je cooler die Gestaltung deines Firmen-Outfits, desto mehr Kunden kannst du ihre Daten abluchsen. Die Oberfläche muss glänzen!",
        action_cost: 900,
        bonus_profiles:8000,
        bonus_cost: 20
      },{
        bought:true,
        locked:false,
        id:"p2",
        title:'"Der grosse IQ-Test"',
        logo:"img/upgrades/test1_s1.png",
        logo_big:"img/upgrades/test1-big_s1.png",
        description:"Mit einem netten, kleinen Test zur Ermittlung des sogenannten Intelligenzquotienten kannst du beim Internet-Publikum immer punkten - da stehen die Leute drauf.",
        action_cost: 800,
        bonus_cost: 10,
        bonus_token:['iq'],
        bonus_risk: 1
      },
      {
        bought:false,
        locked:false,
        id:"p3",
        title:'"Wie treu bist du?"',
        logo:"img/upgrades/test2_s1.png",
        logo_big:"img/upgrades/test2-big_s1.png",
        description:"Mit diesem Test kannst du die Vertrauenswürdigkeit, Zuverlässigkeit und Loyalität deiner User untersuchen. Die Ergebnisse gelten natürlich nicht nur für Beziehungskisten.",
        action_cost: 1300,
        bonus_cost: 10,
        bonus_token:['vertrauenswuerdigoderunzuverlaessig'],
        bonus_risk: 1
      },
      {
        bought:false,
        locked:false,
        id:"p4",
        title:'"Bin ich depressiv?"',
        logo:"img/upgrades/test3_s1.png",
        logo_big:"img/upgrades/test3-big_s1.png",
        description:"Glücklich und zufrieden oder doch eher frustriert bis depressiv? Echte Depression ist zwar kein Spass, aber für die Ergebnisse dieses Tests findest du sicher Abnehmer.",
        bonus_token:['zufriedenoderfrustriert'],
        action_cost: 1300,
        bonus_cost: 10,
        bonus_risk: 1
      },
      {
        bought:false,
        locked:true,
        id:"p5",
        title:'Banner Anzeigen',
        logo:"img/upgrades/locked_s1.png",
        action_cost: 0
      },
      {
        bought:true,
        locked:false,
        id:"p6",
        title:"Ergebnis per Email",
        logo:"img/upgrades/ergebnisperemail_s1.png",
        logo_big:"img/upgrades/ergebnisperemail-big_s1.png",
        description:"Die Tests sind natürlich völlig anonym! Die ausführliche, super-seriöse Premium-Auswertung bekommen die Teilnehmer aber gerne per Email zugeschickt. Dazu erfragst du ihre Email-Adresse.",
        action_cost: 1500,
        bonus_cost: 30,
        bonus_token:['email'],
        bonus_risk: 2
      },
      {
        bought:false,
        locked:false,
        id:"p7",
        title:"Ergebnis per Post",
        logo:"img/upgrades/ergebnisperpost_s1.png",
        logo_big:"img/upgrades/ergebnisperpost-big_s1.png",
        description:"Die Tests sind natürlich völlig anonym! Die ausführliche, super-seriöse Premium-Auswertung bekommen die Teilnehmer aber gerne per Post zugeschickt. Dazu erfragst du Namen und Adresse.",
        bonus_cost: 40,
        action_cost: 2400,
        bonus_token:['vorname','nachname','adresse','wohnort'],
        bonus_risk: 2
      },
      {
        bought:false,
        locked:false,
        id:"p8",
        title:"Privacy Policy",
        logo:"img/upgrades/privacy_s1.png",
        logo_big:"img/upgrades/privacy-big_s1.png",
        description:"Je länger, unverständlicher und vertrauenserweckender deine \"Erklärung zur Privatsphäre\" formuliert ist, desto bedenkenloser öffnen dir die Leute ihr Herz. ",
        action_cost: 2800,
        bonus_profiles:17000,
        bonus_risk:-1
      }
     ],
    // psychotest werbung
    actions: [
      {
        bought:false,
        locked:false,
        id:"a1",
        title:"TV Spot",
        logo:"img/actions/tv-spot_s1.png",
        logo_big:"img/actions/tv-spot-big_s1.png",
        description:"Werbespots fürs Fernsehen sind nicht ganz billig zu drehen, dafür umso effektiver. Eine richtig schlechte Pointe ist dabei besonders wichtig.",
        action_cost: 1900,
        bonus_profiles: 17000,
        bonus_cost: 70,
        bonus_risk: -1
      },
     {
        bought:false,
        locked:true,
        id:"a2",
        title:"Radio-Spot",
        logo:"img/upgrades/locked_s1.png",
        action_cost: 1900,
        bonus_profiles: 17000
      },
      {
        bought:false,
        locked:true,
        id:"a3",
        title:"Zeitungsanzeige",
        logo:"img/upgrades/locked_s1.png",
        description:"",
        action_cost: 2500,
        bonus_profiles:5
      },
      {
        bought:false,
        locked:false,
        id:"a5",
        title:"Ex-Sportler",
        logo:"img/actions/sportler_s1.png",
        logo_big:"img/actions/sportler-big_s1.png",
        description:"Kauf dir einen Promi und lass ihn für dich werben. Ex-SportlerInnen sind auf jeden Fall beliebter als Ex-PolitikerInnen und als Lieblinge der Nation besonders gut für deine Zwecke geeignet.",
        action_cost: 2200,
        bonus_profiles: 21000,
        bonus_cost: 90,
        bonus_risk: -1
      },
      {
        bought:false,
        locked:true,
        id:"a5",
        title:"Banner-Anzeigen",
        logo:"img/upgrades/locked_s1.png",
        action_cost: 0,
        bonus_profiles:5
      },
      {
        bought:false,
        locked:false,
        id:"a6",
        title:"Bezahlte Postings",
        logo:"img/actions/online_s1.png",
        logo_big:"img/actions/online-big_s1.png",
        description:"Check dir ein paar Online-Sklaven und lass sie unter falschem Namen dein Produkt bejubeln. Eine kleine Dosis Kritik darf schon mal dabei sein, dann wirds glaubwürdiger.",
        action_cost: 1400,
        bonus_profiles: 25000,
        bonus_cost: 120,
        bonus_risk: -1
      },
      {
        bought:false,
        locked:false,
        id:"a7",
        title:"Hobby Website",
        logo:"img/actions/online_s1.png",
        logo_big:"img/actions/online-big_s1.png",
        description:"Stell eine dilettantisch gemachte Hobby-Website online, die sich mit deinem Angebot beschäftigt. So was wird gut von Suchmaschinen gefunden und kommt ziemlich glaubwürdig rüber.",
        action_cost: 900,
        bonus_profiles: 17000,
        bonus_cost: 50,
        bonus_risk: -1
      },
      {
        bought:false,
        locked:false,
        id:"a8",
        title:"Internet Video",
        logo:"img/actions/online_s1.png",
        logo_big:"img/actions/online-big_s1.png",
        description:"Viel billiger als ein TV Spot: Dreh ein schlechtes Handy-Video mit irgendeiner peinlichen Aktion. Die Leute schicken sowas weiter wie wild und nehmen es dir selten übel, wenn du das danach als Werbung outest.",
        action_cost: 2600,
        bonus_profiles: 33000,
        bonus_cost: 20,
        bonus_risk: -1
      }
    ],
    team: [
      {
        bought:false,
        locked:false,
        id:"t1",
        title:team.manager.title,
        logo:team.manager.logo,
        logo_big:team.manager.logo_big,
        description:team.manager.description,
        action_cost: 600,
        bonus_profiles: 6000,
        bonus_cost: 40
      },
      {
        bought:false,
        locked:false,
        id:"t2",
        title:team.managerin.title,
        logo:team.managerin.logo,
        logo_big:team.managerin.logo_big,
        description:team.managerin.description,
        action_cost: 500,
        bonus_profiles: 7000,
        bonus_cost: 30
      },
      {
        bought:false,
        locked:false,
        id:"t5",
        title:team.programmierer2.title,
        logo:team.programmierer2.logo,
        logo_big:team.programmierer2.logo_big,
        description:team.programmierer2.description,
        action_cost: 500,
        bonus_profiles: 8000,
        bonus_cost: 50
      },
      {
        bought:false,
        locked:false,
        id:"t4",
        title:team.programmierer.title,
        logo:team.programmierer.logo,
        logo_big:team.programmierer.logo_big,
        description:team.programmierer.description,
        action_cost: 800,
        bonus_profiles: 12000,
        bonus_cost: 70
      },
      {
        bought:false,
        locked:false,
        id:"t3",
        title:team.werbefuzzi.title,
        logo:team.werbefuzzi.logo,
        logo_big:team.werbefuzzi.logo_big,
        description:team.werbefuzzi.description,
        action_cost: 600,
        bonus_profiles: 14000,
        bonus_cost: 70,
        bonus_risk: -1
      },
      {
        bought:false,
        locked:false,
        id:"t6",
        title:team.forscherin.title,
        logo:team.forscherin.logo,
        logo_big:team.forscherin.logo_big,
        description:team.forscherin.description,
        action_cost: 1000,
        bonus_profiles: 15000,
        bonus_cost: 70
      },
      {
        bought:false,
        locked:false,
        id:"t7",
        title:team.psychologe.title,
        logo:team.psychologe.logo,
        logo_big:team.psychologe.logo_big,
        description:team.psychologe.description,
        action_cost: 1200,
        bonus_profiles: 18000,
        bonus_cost: 80
      },
      {
        bought:false,
        locked:false,
        id:"t8",
        title:team.anwalt.title,
        logo:team.anwalt.logo,
        logo_big:team.anwalt.logo_big,
        description:team.anwalt.description,
        action_cost: 850,
        bonus_profiles:11000,
        bonus_risk:-1,
        bonus_cost:60
      }
    ]
},
{
    x: 1317,
    y: 441,
    font_attr: LABEL_FONT,
    label: 'Vorteilsclub',
    title: 'Vorteilsclub',
    data_id:'vorteilsclub',
    description:"Sag mir, was du kaufst, und ich sage dir, wer du bist. Betreib ein Kundenkarten-System für Supermärkte, Tankstellen, Möbelhäuser oder Fitness-Studios. Die Leute fliegen auf die Sonderangebote im Vorteilsclub und du erfährst alle Details über deren Einkäufe.",
    sprite_w: 144,
    sprite_h: 144,
    sprite_img: 'img/project-vorteilsclub_s1.png',
    sprite_img_down: 'img/project-vorteilsclub-down_s1.png',
    sprite_img_hover: 'img/project-vorteilsclub-hover_s1.png',
    sprite_img_drag: 'img/project-vorteilsclub-drag_s1.png',
    logo:"img/project-vorteilsclub-logo.png",
    ready: true,
    action_cost: 120,
    action_time: 60000,
    base_amount: 0,
    base_risk: 1,
    tokens:[
            'vorname',
            'nachname',
            'adresse',
            'wohnort',
            'geburtsdatum',
            'geschlecht',
            'telefonnummer',
            'email',
            'konsumgewohnheiten'
            //'ernaehrungsweise'
            ],
    upgrades:[
      {
        bought:false,
        locked:false,
        id:"p1",
        title:"Logo & Design",
        logo:"img/upgrades/design_s1.png",
        logo_big:"img/upgrades/design-big_s1.png",
        description:"Die Oberfläche muss glänzen! Dein Projekt muss von vorne bis hinten durchgestylt sein, dann ist der Erfolg sicher. Je cooler die Gestaltung deines Firmen-Outfits, desto mehr Kunden kannst du ihre Daten abluchsen.",
        action_cost: 900,
        bonus_profiles: 800,
        bonus_cost: 20
      },
      {
        bought:true,
        locked:false,
        id:"p2",
        logo:"img/upgrades/design_s1.png",
        logo_big:"img/upgrades/design-big_s1.png",
        title:"Partnerschaft mit Supermarkt-Kette",
        logo:"img/upgrades/supermarkt_s1.png",
        logo_big:"img/upgrades/supermarkt-big_s1.png",
        description:"Die Partnerschaft mit einer Supermarkt-Kette ist nur der erste Schritt. Danach kannst du dein Kundenkarten-System immer noch an Tankstellen, Möbelketten, Buchhandlungen oder Fitness-Studios verdrehen.",
        action_cost: 1000,
        bonus_token:['ernaehrungsweise'],
        bonus_profiles: 1200,
        bonus_cost: 60,
        bonus_risk: 3
      },
      {
        bought:false,
        locked:false,
        id:"p3",
        title:"Partnerschaft mit Möbelhaus-Kette",
        logo:"img/upgrades/moebel_s1.png",
        logo_big:"img/upgrades/moebel-big_s1.png",
        description:"Erhöhe deine Reichweite durch eine Partnerschaft mit einer Möbelhaus-Kette. Die schicke Familien-Clubkarte ist bei jedem Einkauf dabei, durch die Analyse des Kaufverhaltens über einen längeren Zeitraum kannst du auf das Einkommen rückschließen.",
        action_cost: 1400,
        bonus_token:['einkommen'],
        bonus_profiles: 8000,
        bonus_cost: 40,
        bonus_risk: 3
      },
      {
        bought:false,
        locked:false,
        id:"p4",
        title:"Partnerschaft mit Buchhandels-Kette",
        logo:"img/upgrades/buch_s1.png",
        logo_big:"img/upgrades/buch-big_s1.png",
        description:"Erhöhe deine Reichweite durch eine Partnerschaft mit einer Buchhandels-Kette. Durch eine Analyse des Kaufverhaltens über einen längeren Zeitraum kannst du auf die politische Einstellung rückschließen.",
        action_cost: 1200,
        bonus_token:['politischeeinstellung'],
        bonus_profiles: 6000,
        bonus_cost: 30,
        bonus_risk: 3
      },
      {
        bought:false,
        locked:true,
        id:"p5",
        title:"Partnerschaft mit Fitnessstudio-Kette",
        logo:"img/upgrades/locked_s1.png",
        description:"",
        action_cost: 2500,
        bonus_profiles:600
      },
      {
        bought:false,
        locked:true,
        id:"p6",
        title:"Partnerschaft mit Mode-Kette",
        logo:"img/upgrades/locked_s1.png",
        description:"",
        action_cost: 2500,
        bonus_profiles:600
      },
      {
        bought:false,
        locked:false,
        id:"p7",
        title:"Bonus Programm",
        logo:"img/upgrades/bonus_s1.png",
        logo_big:"img/upgrades/bonus-big_s1.png",
        description:"Die Kunden und Kundinnen bekommen leckere Bonus-Angebote, wenn sie einen kleinen Fragebogen ausfüllen. Die Antworten dienen natürlich ausschließlich zur Verbesserung des Service!",
        action_cost: 600,
        bonus_profiles: 4000,
        bonus_cost: 10
      },
      {
        bought:false,
        locked:false,
        id:"p8",
        title:"Privacy Policy",
        logo:"img/upgrades/privacy_s1.png",
        logo_big:"img/upgrades/privacy-big_s1.png",
        description:"Je länger, unverständlicher und vertrauenserweckender deine \"Erklärung zur Privatsphäre\" formuliert ist, desto bedenkenloser öffnen dir die Leute ihr Herz.",
        action_cost: 2800,
        bonus_profiles: 17000,
        bonus_risk: -1
      }
    ],
    // vorteilsclub werbung
     actions: [
       {
        bought:false,
        locked:false,
        id:"a1",
        title:"TV Spot",
        logo:"img/actions/tv-spot_s1.png",
        logo_big:"img/actions/tv-spot-big_s1.png",
        description:"Werbespots fürs Fernsehen sind nicht ganz billig zu drehen, dafür umso effektiver. Eine richtig schlechte Pointe ist dabei besonders wichtig.",
        bonus_profiles:17000,
        action_cost: 1900,
        bonus_cost: 70,
        bonus_risk: -1
      },
       {
        bought:false,
        locked:false,
        id:"a4",
        title:"Plakatwerbung",
        logo:"img/actions/plakat_s1.png",
        logo_big:"img/actions/plakat-big_s1.png",
        description:"Lass dir ein überzeugendes Plakat designen und pflastere die Straßen damit voll. Ein wenig provokant muss es schon sein, damit auch wirklich was hängen bleibt!",
        bonus_profiles: 8000,
        action_cost: 700,
        bonus_cost: 30,
        bonus_risk: -1
      },

      {
        bought:false,
        locked:false,
        id:"a2",
        title:"Skispringen",
        logo:"img/actions/skijump_s1.png",
        logo_big:"img/actions/skijump-big_s1.png",
        description:"Als Hauptsponsor beim Skispringen wirst du schnell bekannt und die sportlichen Couch-Profile werden dir nur so zufliegen.",
        bonus_profiles: 10000,
        action_cost: 1200,
        bonus_cost: 30,
        bonus_risk: -1
      },
      { 
        bought:false,
        locked:false,
        id:"a3",
        title:"Maturareise",
        logo:"img/actions/maturareise_s1.png",
        logo_big:"img/actions/maturareise-big_s1.png",
        description:"Massen-Maturareisen nach Griechenland sind kein Kindergeburtstag und darum das optimale Umfeld, um ein paar Tausend Delirium-Profile abzuschleppen.",
        bonus_profiles: 5000,
        action_cost: 400,
        bonus_cost: 20,
        bonus_risk: -1
       },
       {
        bought:false,
        locked:false,
        id:"a5",
        title:"Ex-Sportler",
        logo:"img/actions/sportler_s1.png",
        logo_big:"img/actions/sportler-big_s1.png",
        description:"Kauf dir einen Promi und lass ihn für dich werben. Ex-SportlerInnen sind auf jeden Fall beliebter als Ex-PolitikerInnen und als Lieblinge der Nation besonders gut für deine Zwecke geeignet.",
        bonus_profiles: 28000,
        action_cost: 2800,
        bonus_cost: 120,
        bonus_risk: -1
      },
       {
        bought:false,
        locked:false,
        id:"a6",
        title:"Baumeister",
        logo:"img/actions/baumeister_s1.png",
        logo_big:"img/actions/baumeister-big_s1.png",
        description:"Kauf dir einen Promi und lass ihn für dich werben. Baumeister sind hierzulande eine besondere Spezialität. Achtung: nicht für jeden Zweck geeignet!",
        bonus_profiles: 16000,
        action_cost: 900,
        bonus_cost: 100,
        bonus_risk: -1
      },

       {
        bought:false,
        locked:true,
        id:"a7",
        title:"TV Moderator",
        logo:"img/upgrades/locked_s1.png",
        description:"",
        action_cost: 500
      },
       {
        bought:false,
        locked:false,
        id:"a8",
        title:"Bezahlte Postings",
        logo:"img/actions/online_s1.png",
        logo_big:"img/actions/online-big_s1.png",
        description:"Check dir ein paar Online-Sklaven und lass sie unter falschem Namen dein Produkt bejubeln. Eine kleine Dosis Kritik darf schon mal dabei sein, dann wirds glaubwürdiger.",
        bonus_profiles:25000,
        action_cost: 1400,
        bonus_cost: 120,
        bonus_risk: -1
      }
    ],
    // vorteilsclub team
    team: [
      {
        bought:false,
        locked:false,
        id:"t1",
        title:team.manager.title,
        logo:team.manager.logo,
        logo_big:team.manager.logo_big,
        description:team.manager.description,
        action_cost: 600,
        bonus_profiles:5000,
        bonus_cost: 30
      },
      {
        bought:false,
        locked:false,
        id:"t2",
        title:team.managerin.title,
        logo:team.managerin.logo,
        logo_big:team.managerin.logo_big,
        description:team.managerin.description,
        action_cost: 500,
        bonus_profiles:6000,
        bonus_cost: 20
      },
      {
        bought:true,
        locked:false,
        id:"t4",
        title:team.werbefuzzi.title,
        logo:team.werbefuzzi.logo,
        logo_big:team.werbefuzzi.logo_big,
        description:team.werbefuzzi.description,
        action_cost: 600,
        bonus_profiles: 14000,
        bonus_cost: 70,
        bonus_risk: -1
      },
      {
        bought:false,
        locked:false,
        id:"t5",
        title:team.werbefuzzi2.title,
        logo:team.werbefuzzi2.logo,
        logo_big:team.werbefuzzi2.logo_big,
        description:team.werbefuzzi2.description,
        action_cost: 800,
        bonus_profiles: 8000,
        bonus_cost: 80
      },
      {
        bought:false,
        locked:false,
        id:"t3",
        title:team.praktikant.title,
        logo:team.praktikant.logo,
        logo_big:team.praktikant.logo_big,
        description:team.praktikant.description,
        action_cost: 20,
        bonus_profiles:2000,
        bonus_cost: 6
      },
      {
        bought:false,
        locked:false,
        id:"t6",
        title:team.praktikantin.title,
        logo:team.praktikantin.logo,
        logo_big:team.praktikantin.logo_big,
        description:team.praktikantin.description,
        action_cost: 10,
        bonus_profiles:3000,
        bonus_cost: 4
      },
      {
        bought:false,
        locked:false,
        id:"t7",
        title:team.psychologe.title,
        logo:team.psychologe.logo,
        logo_big:team.psychologe.logo_big,
        description:team.psychologe.description,
        action_cost: 1200,
        bonus_profiles:18000,
        bonus_cost: 80
      },
      {
        bought:false,
        locked:false,
        id:"t8",
        title:team.anwalt.title,
        logo:team.anwalt.logo,
        logo_big:team.anwalt.logo_big,
        description:team.anwalt.description,
        action_cost: 800,
        bonus_profiles:11000,
        bonus_cost: 60,
        bonus_risk: -1
      }
    ]
}

]

var database_data = {
    x: 828,
    y: 433,
    font_attr: LABEL_FONT,
    label: 'Datenbank',
    sprite_w: 192,
    sprite_h: 240, 
    sprite_img: 'img/datenbank_s1.png',
    sprite_img_hover: 'img/datenbank-hover_s1.png',
    sprite_img_drag: 'img/datenbank-drag_s1.png',
    sprite_img_down: 'img/datenbank-down_s1.png',
}

var default_ready_decorator = {
    offset_x: 25,
    offset_y: -55,
    sprite_img: 'img/action-profileabholen_s1.png',
    sprite_img_hover: 'img/action-profileabholen-hover_s1.png',
    sprite_w: 80,
    sprite_h: 80
}
var default_working_decorator = {
    offset_x: 115,
    offset_y: -5,
    sprite_img: 'img/icon-timer_s1.png',
    sprite_img_hover: 'img/icon-timer_s1.png',
    sprite_w: 30,
    sprite_h: 30
}
var customer_ready_decorator = {
    offset_x: 25,
    offset_y: -52,
    sprite_img: 'img/action-cashabholen_s1.png',
    sprite_img_hover: 'img/action-cashabholen-hover_s1.png',
    sprite_w: 90,
    sprite_h: 76
}
var db_decorator = {
    offset_x: 6,
    offset_y: 16,
    sprite_img: 'img/icon-profile_s1.png',
    sprite_img_hover: 'img/icon-profile_s1.png',
    sprite_w: 16,
    sprite_h: 16
}

var bar_decorator = {
    offset_x: 15,
    offset_y: 96,
    sprite_img: 'img/token_bar.png',
    sprite_img_hover: 'img/token_bar.png',
    sprite_w: 95,
    sprite_h: 23,
    bar_height: 8,
    bar_offset_left: 4,
    bar_offset_right: 11,
    bar_offset_top: 4,
    bar_radius: 3
}



var STATUS_BARS = { 
        profile_bar:{ 
                        id: 'profile_bar',
                        font_attr: STATUS_BAR_FONT,
                        text_offset_x: 10,
                        bar_image: 'img/statusbar-background.png',
                        deco_image: 'img/statusbar-profile.png',
                        bar_dim: {x: 15, y: 10, w: 160, h:36},
                        deco_dim: {x: 5, y:0, w: 51, h: 57},
                        prog_attr: {'fill': '#009fd9','stroke':'#e48931','stroke-width':0},
                        prog_attr_active: {'fill': '#BFE7F5'},
                        init_val: 1132893,
                        max_val: 8430558
                    },
        money_bar:  { 
                        id: 'money_bar',
                        font_attr: STATUS_BAR_FONT,
                        text_offset_x: 0,
                        bar_image: 'img/statusbar-background.png',
                        deco_image: 'img/statusbar-kohle.png',
                        bar_dim: {x: 217, y: 10, w: 160, h:36},
                        deco_dim: {x: 180, y:0, w: 64, h: 57},
                        prog_attr: {'fill': '#5da445','stroke':'#B6D7A8','stroke-width':0},
                        prog_attr_active: {'fill': '#B6D7A8'},
                        init_val: 5000,
                        max_val: 1
                    },
        ap_bar:     { 
                        id: 'ap_bar',
                        font_attr: STATUS_BAR_FONT,
                        text_offset_x: 0,
                        bar_image: 'img/statusbar-background.png',
                        deco_image: 'img/statusbar-ap.png',
                        bar_dim: {x: 395, y: 10, w: 160, h:36},
                        deco_dim: {x: 380, y:0, w: 45, h: 57},
                        prog_attr: {'fill': '#e48931','stroke':'none','stroke-width':0},
                        prog_attr_active: {'fill': '#FFD800'},
                        init_val: 15,
                        max_val: 15
                    },
        image_bar:  { 
                        id: 'image_bar',
                        font_attr: STATUS_BAR_FONT,
                        text_offset_x: 0,
                        bar_image: 'img/statusbar-background.png',
                        deco_image: 'img/statusbar-image.png',
                        bar_dim: {x: 585, y: 10, w: 160, h:36},
                        deco_dim: {x: 560, y:0, w: 49, h: 57},
                        prog_attr: {'fill': '#cd495d','stroke':'none','stroke-width':0},
                        prog_attr_active: {'fill': '#EA9999'},
                        init_val: 5,
                        max_val: 100
                    },
        xp_bar:     { 
                        id: 'xp_bar',
                        font_attr: STATUS_BAR_FONT,
                        text_offset_x: 0,
                        bar_image: 'img/statusbar-background.png',
                        deco_image: 'img/statusbar-xp.png',
                        bar_dim: {x: 750, y: 10, w: 160, h:36},
                        deco_dim: {x: 890, y:0, w: 64, h: 57},
                        prog_attr: {'fill': '#ffff00','stroke':'none','stroke-width':0},
                        prog_attr_active: {'fill': '#FFE'},
                        init_val: 16,
                        levels: [
                            [0, 0],
                            [1, 5],
                            [6, 20],
                            [21, 30],
                            [31, 50],
                            [51, 80],
                            [81, 120],
                            [121, 180],
                            [181, 260],
                            [261, 360],
                            [360, 500],
                            [501, 1000],
                            [1001, 5000],
                            [1001, 5000],
                            [5001, 10000],
                            [10001, 20000],
                            [20001, 50000],
                            [50001, 100000],
                            [100001, 999999999999]
                        ]
                    }
};

function extend(C, P) {
    var F = function() {};
    F.prototype = P.prototype;
    C.prototype = new F();
    C.prototype.constructor = C;
    C.P = P.prototype;
}


