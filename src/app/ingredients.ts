import { Injectable } from '@angular/core';

export class Ingredient {
    public name: string;
    public properties = new Array<PropertyIngredient>();
    public quantity: number;

    constructor(public all: All, public s: string) {
        this.quantity=0;
        let parts = s.split("!");
        this.name = parts[0];
        for (let i = 1; i < 5; i++) {
            let p = all.getP(parts[i]);
            this.properties.push(new PropertyIngredient(p));
        }
    }
}

export class PropertyIngredient {
    public known: boolean;
    constructor(public property: Property) {
        this.known = false;
     }
}


export class Property {
    constructor(public name: string) { }
}

export class Formula {
    rank:number;
    constructor(public ingredients: Array<Ingredient>) {
    }

    available(): boolean {
        return this.ingredients.every(e => e.quantity > 0);
    }

    counter:Counter;

    rankByDiscovery(): number {
        let rank = 0;
        this.counter=new Counter();
        this.ingredients.forEach(e => {
            e.properties.forEach(p => {
                this.counter.add(p.property.name);
            }
            )
        });


        this.ingredients.forEach(e => {
            e.properties.forEach(p => {
                if (!p.known && this.counter.get(p.property.name) > 1) {
                    rank += 1;
                }
            }
            )
        });

        rank = rank * 6 / this.ingredients.length;
        this.rank=rank;
        return rank;
    }

    done():void{
        this.ingredients.forEach(e => {
            e.quantity-=1;
            
            if(e.quantity<0){
                e.quantity=0;
            }

            e.properties.forEach(p => {
                if (!p.known && this.counter.get(p.property.name) > 1) {
                    p.known = true;
                }
            }
            )
        });
    }
}

export class Counter {
    map = new Map<string, number>();

    add(s: string): void {
        if (this.map.has(s)) {
            this.map.set(s, this.map.get(s) + 1);
        } else {
            this.map.set(s, 1);
        }
    }

    reduceOne(): void {
        let keys = this.map.entries();
        for (let k in keys) {
            this.map.set(k, this.map.get(k) - 1);
        }
    }

    get(s: string): number {
        if (this.map.has(s)) {
            return this.map.get(s);
        }
        return 0;
    }
}

@Injectable()
export class All {
    elements: Array<Ingredient>;
    nextFormula: Formula;

    constructor() {
        this.initializeData();
        this.load();
    }

    pByname = new Map<string, Property>();

    getP(name: string): Property {
        if (this.pByname.has(name)) {
            return this.pByname.get(name);
        }

        let p = new Property(name);
        this.pByname.set(name, p);
        return p;
    }

    generateFormula(): boolean {
        let available = this.elements.filter(e => e.quantity > 0);
        let best: Formula;
        for (let a of available){
            console.log("a:"+a.name);
            for(let b of available){
                if(b===a){
                    continue;
                }

                let f = new Formula([a,b]);
                if(best == null || f.rankByDiscovery() > best.rankByDiscovery()){
                    best=f;
                }
                
                for(let c of available){
                    if(c===a || c===b){
                        continue;
                    }

                    let f = new Formula([a,b,c]);
                    if(best == null || f.rankByDiscovery() > best.rankByDiscovery()){
                        best=f;
                    }
                }
            }
        }

        this.nextFormula = best;
        return best!=null;
    }

    save():void{
        for(let e of this.elements){
            localStorage.setItem(e.name,JSON.stringify(e.quantity));

            for(let p of e.properties){
                localStorage.setItem(e.name + "?" + p.property.name, JSON.stringify(p.known));
            }
        }
    }

    load():void{
        for(let e of this.elements){
            let jsonquantity = localStorage.getItem(e.name);
            if(jsonquantity) {
                e.quantity = JSON.parse(jsonquantity) as number;
            }

            for(let p of e.properties){
                let jsonknown = localStorage.getItem(e.name + "?" + p.property.name);
                if(jsonknown){
                    p.known = JSON.parse(jsonknown);
                }
            }
        }
    }


    initializeData():void{

        this.elements = new Array<Ingredient>();

        this.elements.push(new Ingredient(this, "Abecean Longfin!Weakness to Frost!Fortify Sneak!Weakness to Poison!Fortify Restoration"));
        this.elements.push(new Ingredient(this, "Glow Dust!Damage Magicka!Damage Magicka Regen!Fortify Destruction!Resist Shock"));
        this.elements.push(new Ingredient(this, "Boar Tusk‡!Fortify Stamina!Fortify Health!Fortify Block!Frenzy"));
        this.elements.push(new Ingredient(this, "Chaurus Hunter Antennae*!Damage Stamina!Fortify Conjuration!Damage Magicka Regen!Fortify Enchanting"));
        this.elements.push(new Ingredient(this, "Snowberries!Resist Fire!Fortify Enchanting!Resist Frost!Resist Shock"));
        this.elements.push(new Ingredient(this, "Mora Tapinella!Restore Magicka!Lingering Damage Health!Regenerate Stamina!Fortify Illusion"));
        this.elements.push(new Ingredient(this, "Felsaad Tern Feathers‡!Restore Health!Fortify Light Armor!Cure Disease!Resist Magic"));
        this.elements.push(new Ingredient(this, "Void Salts!Weakness to Shock!Resist Magic!Damage Health!Fortify Magicka"));
        this.elements.push(new Ingredient(this, "Berit's Ashes!Damage Stamina!Resist Fire!Fortify Conjuration!Ravage Stamina"));
        this.elements.push(new Ingredient(this, "Sabre Cat Tooth!Restore Stamina!Fortify Heavy Armor!Fortify Smithing!Weakness to Poison"));
        this.elements.push(new Ingredient(this, "Moon Sugar!Weakness to Fire!Resist Frost!Restore Magicka!Regenerate Magicka"));
        this.elements.push(new Ingredient(this, "Slaughterfish Egg!Resist Poison!Fortify Pickpocket!Lingering Damage Health!Fortify Stamina"));
        this.elements.push(new Ingredient(this, "Ice Wraith Teeth!Weakness to Frost!Fortify Heavy Armor!Invisibility!Weakness to Fire"));
        this.elements.push(new Ingredient(this, "Blue Mountain Flower!Restore Health!Fortify Conjuration!Fortify Health!Damage Magicka Regen"));
        this.elements.push(new Ingredient(this, "Frost Mirriam!Resist Frost!Fortify Sneak!Ravage Magicka!Damage Stamina Regen"));
        this.elements.push(new Ingredient(this, "Scaly Pholiota!Weakness to Magic!Fortify Illusion!Regenerate Stamina!Fortify Carry Weight"));
        this.elements.push(new Ingredient(this, "Lavender!Resist Magic!Fortify Stamina!Ravage Magicka!Fortify Conjuration"));
        this.elements.push(new Ingredient(this, "Bone Meal!Damage Stamina!Resist Fire!Fortify Conjuration!Ravage Stamina"));
        this.elements.push(new Ingredient(this, "Ashen Grass Pod‡!Resist Fire!Weakness to Shock!Fortify Lockpicking!Fortify Sneak"));
        this.elements.push(new Ingredient(this, "Giant's Toe!Damage Stamina!Fortify Health!Fortify Carry Weight!Damage Stamina Regen"));
        this.elements.push(new Ingredient(this, "Chicken's Egg!Resist Magic!Damage Magicka Regen!Waterbreathing!Lingering Damage Stamina"));
        this.elements.push(new Ingredient(this, "Silverside Perch!Restore Stamina!Damage Stamina Regen!Ravage Health!Resist Frost"));
        this.elements.push(new Ingredient(this, "Mudcrab Chitin!Restore Stamina!Cure Disease!Resist Poison!Resist Fire"));
        this.elements.push(new Ingredient(this, "Briar Heart!Restore Magicka!Fortify Block!Paralysis!Fortify Magicka"));
        this.elements.push(new Ingredient(this, "Juniper Berries!Weakness to Fire!Fortify Marksman!Regenerate Health!Damage Stamina Regen"));
        this.elements.push(new Ingredient(this, "Blue Dartwing!Resist Shock!Fortify Pickpocket!Restore Health!Fear"));
        this.elements.push(new Ingredient(this, "Elves Ear!Restore Magicka!Fortify Marksman!Weakness to Frost!Resist Fire"));
        this.elements.push(new Ingredient(this, "Bleeding Crown!Weakness to Fire!Fortify Block!Weakness to Poison!Resist Magic"));
        this.elements.push(new Ingredient(this, "Dwarven Oil!Weakness to Magic!Fortify Illusion!Regenerate Magicka!Restore Magicka"));
        this.elements.push(new Ingredient(this, "Bee!Restore Stamina!Ravage Stamina!Regenerate Stamina!Weakness to Shock"));
        this.elements.push(new Ingredient(this, "Poison Bloom*!Damage Health!Slow!Fortify Carry Weight!Fear"));
        this.elements.push(new Ingredient(this, "Troll Fat!Resist Poison!Fortify Two-Handed!Frenzy!Damage Health"));
        this.elements.push(new Ingredient(this, "Large Antlers!Restore Stamina!Fortify Stamina!Slow!Damage Stamina Regen"));
        this.elements.push(new Ingredient(this, "Ancestor Moth Wing*!Damage Stamina!Fortify Conjuration!Damage Magicka Regen!Fortify Enchanting"));
        this.elements.push(new Ingredient(this, "White Cap!Weakness to Frost!Fortify Heavy Armor!Restore Magicka!Ravage Magicka"));
        this.elements.push(new Ingredient(this, "Hanging Moss!Damage Magicka!Fortify Health!Damage Magicka Regen!Fortify One-Handed"));
        this.elements.push(new Ingredient(this, "Hagraven Feathers!Damage Magicka!Fortify Conjuration!Frenzy!Weakness to Shock"));
        this.elements.push(new Ingredient(this, "Imp Stool!Damage Health!Lingering Damage Health!Paralysis!Restore Health"));
        this.elements.push(new Ingredient(this, "Daedra Heart!Restore Health!Damage Stamina Regen!Damage Magicka!Fear"));
        this.elements.push(new Ingredient(this, "Hagraven Claw!Resist Magic!Lingering Damage Magicka!Fortify Enchanting!Fortify Barter"));
        this.elements.push(new Ingredient(this, "Skeever Tail!Damage Stamina Regen!Ravage Health!Damage Health!Fortify Light Armor"));
        this.elements.push(new Ingredient(this, "Human Heart!Damage Health!Damage Magicka!Damage Magicka Regen!Frenzy"));
        this.elements.push(new Ingredient(this, "Garlic!Resist Poison!Fortify Stamina!Regenerate Magicka!Regenerate Health"));
        this.elements.push(new Ingredient(this, "Human Flesh!Damage Health!Paralysis!Restore Magicka!Fortify Sneak"));
        this.elements.push(new Ingredient(this, "Small Pearl!Restore Stamina!Fortify One-Handed!Fortify Restoration!Resist Frost"));
        this.elements.push(new Ingredient(this, "Torchbug Thorax!Restore Stamina!Lingering Damage Magicka!Weakness to Magic!Fortify Stamina"));
        this.elements.push(new Ingredient(this, "Honeycomb!Restore Stamina!Fortify Block!Fortify Light Armor!Ravage Stamina"));
        this.elements.push(new Ingredient(this, "Crimson Nirnroot!Damage Health!Damage Stamina!Invisibility!Resist Magic"));
        this.elements.push(new Ingredient(this, "Tundra Cotton!Resist Magic!Fortify Magicka!Fortify Block!Fortify Barter"));
        this.elements.push(new Ingredient(this, "Spawn Ash‡!Ravage Stamina!Resist Fire!Fortify Enchanting!Ravage Magicka"));
        this.elements.push(new Ingredient(this, "Pine Thrush Egg!Restore Stamina!Fortify Lockpicking!Weakness to Poison!Resist Shock"));
        this.elements.push(new Ingredient(this, "Ash Creep Cluster‡!Damage Stamina!Invisibility!Resist Fire!Fortify Destruction"));
        this.elements.push(new Ingredient(this, "Slaughterfish Scales!Resist Frost!Lingering Damage Health!Fortify Heavy Armor!Fortify Block"));
        this.elements.push(new Ingredient(this, "Eye of Sabre Cat!Restore Stamina!Ravage Health!Damage Magicka!Restore Health"));
        this.elements.push(new Ingredient(this, "Hawk's Egg†!Resist Magic!Damage Magicka Regen!Waterbreathing!Lingering Damage Stamina"));
        this.elements.push(new Ingredient(this, "Gleamblossom*!Resist Magic!Fear!Regenerate Health!Paralysis"));
        this.elements.push(new Ingredient(this, "Salmon Roe†!Restore Stamina!Waterbreathing!Fortify Magicka!Regenerate Magicka"));
        this.elements.push(new Ingredient(this, "Blue Butterfly Wing!Damage Stamina!Fortify Conjuration!Damage Magicka Regen!Fortify Enchanting"));
        this.elements.push(new Ingredient(this, "Beehive Husk!Resist Poison!Fortify Light Armor!Fortify Sneak!Fortify Destruction"));
        this.elements.push(new Ingredient(this, "Butterfly Wing!Restore Health!Fortify Barter!Lingering Damage Stamina!Damage Magicka"));
        this.elements.push(new Ingredient(this, "Purple Mountain Flower!Restore Stamina!Fortify Sneak!Lingering Damage Magicka!Resist Frost"));
        this.elements.push(new Ingredient(this, "Falmer Ear!Damage Health!Frenzy!Resist Poison!Fortify Lockpicking"));
        this.elements.push(new Ingredient(this, "Red Mountain Flower!Restore Magicka!Ravage Magicka!Fortify Magicka!Damage Health"));
        this.elements.push(new Ingredient(this, "Spriggan Sap!Damage Magicka Regen!Fortify Enchanting!Fortify Smithing!Fortify Alteration"));
        this.elements.push(new Ingredient(this, "Yellow Mountain Flower*!Resist Poison!Fortify Restoration!Fortify Health!Damage Stamina Regen"));
        this.elements.push(new Ingredient(this, "Creep Cluster!Restore Magicka!Damage Stamina Regen!Fortify Carry Weight!Weakness to Magic"));
        this.elements.push(new Ingredient(this, "Wheat!Restore Health!Fortify Health!Damage Stamina Regen!Lingering Damage Magicka"));
        this.elements.push(new Ingredient(this, "Hawk Beak!Restore Stamina!Resist Frost!Fortify Carry Weight!Resist Shock"));
        this.elements.push(new Ingredient(this, "Thistle Branch!Resist Frost!Ravage Stamina!Resist Poison!Fortify Heavy Armor"));
        this.elements.push(new Ingredient(this, "Orange Dartwing!Restore Stamina!Ravage Magicka!Fortify Pickpocket!Lingering Damage Health"));
        this.elements.push(new Ingredient(this, "Swamp Fungal Pod!Resist Shock!Lingering Damage Magicka!Paralysis!Restore Health"));
        this.elements.push(new Ingredient(this, "Nordic Barnacle!Damage Magicka!Waterbreathing!Regenerate Health!Fortify Pickpocket"));
        this.elements.push(new Ingredient(this, "Jarrin Root!Damage Health!Damage Magicka!Damage Stamina!Damage Magicka Regen"));
        this.elements.push(new Ingredient(this, "Trama Root!Weakness to Shock!Fortify Carry Weight!Damage Magicka!Slow"));
        this.elements.push(new Ingredient(this, "Nightshade!Damage Health!Damage Magicka Regen!Lingering Damage Stamina!Fortify Destruction"));
        this.elements.push(new Ingredient(this, "Charred Skeever Hide!Restore Stamina!Cure Disease!Resist Poison!Restore Health"));
        this.elements.push(new Ingredient(this, "Rock Warbler Egg!Restore Health!Fortify One-Handed!Damage Stamina!Weakness to Magic"));
        this.elements.push(new Ingredient(this, "Taproot!Weakness to Magic!Fortify Illusion!Regenerate Magicka!Restore Magicka"));
        this.elements.push(new Ingredient(this, "Histcarp!Restore Stamina!Fortify Magicka!Damage Stamina Regen!Waterbreathing"));
        this.elements.push(new Ingredient(this, "Vampire Dust!Invisibility!Restore Magicka!Regenerate Health!Cure Disease"));
        this.elements.push(new Ingredient(this, "Bear Claws!Restore Stamina!Fortify Health!Fortify One-Handed!Damage Magicka Regen"));
        this.elements.push(new Ingredient(this, "Netch Jelly‡!Paralysis!Fortify Carry Weight!Restore Stamina!Fear"));
        this.elements.push(new Ingredient(this, "Giant Lichen!Weakness to Shock!Ravage Health!Weakness to Poison!Restore Magicka"));
        this.elements.push(new Ingredient(this, "River Betty!Damage Health!Fortify Alteration!Slow!Fortify Carry Weight"));
        this.elements.push(new Ingredient(this, "Wisp Wrappings!Restore Stamina!Fortify Destruction!Fortify Carry Weight!Resist Magic"));
        this.elements.push(new Ingredient(this, "Spider Egg!Damage Stamina!Damage Magicka Regen!Fortify Lockpicking!Fortify Marksman"));
        this.elements.push(new Ingredient(this, "Glowing Mushroom!Resist Shock!Fortify Destruction!Fortify Smithing!Fortify Health"));
        this.elements.push(new Ingredient(this, "Burnt Spriggan Wood‡!Weakness to Fire!Fortify Alteration!Damage Magicka Regen!Slow"));
        this.elements.push(new Ingredient(this, "Ash Hopper Jelly‡!Restore Health!Fortify Light Armor!Resist Shock!Weakness to Frost"));
        this.elements.push(new Ingredient(this, "Emperor Parasol Moss‡!Damage Health!Fortify Magicka!Regenerate Health!Fortify Two-Handed"));
        this.elements.push(new Ingredient(this, "Powdered Mammoth Tusk!Restore Stamina!Fortify Sneak!Weakness to Fire!Fear"));
        this.elements.push(new Ingredient(this, "Nirnroot!Damage Health!Damage Stamina!Invisibility!Resist Magic"));
        this.elements.push(new Ingredient(this, "Fly Amanita!Resist Fire!Fortify Two-handed!Frenzy!Regenerate Stamina"));
        this.elements.push(new Ingredient(this, "Dragon's Tongue!Resist Fire!Fortify Barter!Fortify Illusion!Fortify Two-handed"));
        this.elements.push(new Ingredient(this, "Cyrodilic Spadetail!Damage Stamina!Fortify Restoration!Fear!Ravage Health"));
        this.elements.push(new Ingredient(this, "Jazbay Grapes!Weakness to Magic!Fortify Magicka!Regenerate Magicka!Ravage Health"));
        this.elements.push(new Ingredient(this, "Fire Salts!Weakness to Frost!Resist Fire!Restore Magicka!Regenerate Magicka"));
        this.elements.push(new Ingredient(this, "Grass Pod!Resist Poison!Ravage Magicka!Fortify Alteration!Restore Magicka"));
        this.elements.push(new Ingredient(this, "Ectoplasm!Restore Magicka!Fortify Destruction!Fortify Magicka!Damage Health"));
        this.elements.push(new Ingredient(this, "Blisterwort!Damage Stamina!Frenzy!Restore Health!Fortify Smithing"));
        this.elements.push(new Ingredient(this, "Frost Salts!Weakness to Fire!Resist Frost!Restore Magicka!Fortify Conjuration"));
        this.elements.push(new Ingredient(this, "Pearl!Restore Stamina!Fortify Block!Restore Magicka!Resist Shock"));
        this.elements.push(new Ingredient(this, "Small Antlers!Weakness to Poison!Fortify Restoration!Lingering Damage Stamina!Damage Health"));
        this.elements.push(new Ingredient(this, "Luna Moth Wing!Damage Magicka!Fortify Light Armor!Regenerate Health!Invisibility"));
        this.elements.push(new Ingredient(this, "Deathbell!Damage Health!Ravage Stamina!Slow!Weakness to Poison"));
        this.elements.push(new Ingredient(this, "Salt Pile!Weakness to Magic!Fortify Restoration!Slow!Regenerate Magicka"));
        this.elements.push(new Ingredient(this, "Hawk Feathers!Cure Disease!Fortify Light Armor!Fortify One-Handed!Fortify Sneak"));
        this.elements.push(new Ingredient(this, "Scathecraw!Ravage Health!Ravage Stamina!Ravage Magicka!Lingering Damage Health"));
        this.elements.push(new Ingredient(this, "Canis Root!Damage Stamina!Fortify One-Handed!Fortify Marksman!Paralysis"));
        this.elements.push(new Ingredient(this, "Chaurus Eggs!Weakness to Poison!Fortify Stamina!Damage Magicka!Invisibility"));
        this.elements.push(new Ingredient(this, "Namira's Rot!Damage Magicka!Fortify Lockpicking!Fear!Regenerate Health"));

    }
}