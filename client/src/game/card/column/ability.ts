import { Elem } from "../../../core/Elem";

export type Ability = {
    elem: Node,
    update: (value: GoalChangeType)=>void
}

export const Ability = (attributeType: AttributeType, onChange: (changeType: GoalChangeType)=>void): Ability => {
    let bla = document.createElement("div");
    bla.style.color = "";

    let checkbox = Elem("div", {}, [
        Elem("input", { type: "checkbox" }, [])
    ]);

    let scorebox = Elem("textarea", {
        oninput: (ev)=>{
            let target = ev.target as HTMLTextAreaElement;
            onChange({type: "score", value: parseInt(target.value)});
        }
    });

    let description = Elem("textarea", {
        oninput: (ev)=>{
            let target = ev.target as HTMLTextAreaElement;
            onChange({type: "description", value: target.value});
        }
    }, []);

    return {
        elem: Elem("table", {}, [
            Elem("tr", {}, [
                Elem("td", {}, [
                    checkbox,
                    scorebox
                ], {
                    border: "1px solid #dddddd"
                }),
                Elem("td", {}, [
                    description
                ], {
                    border: "1px solid #dddddd"
                })
            ], {
                borderCollapse: "collapse"
            })
        ]),
        update: (attributeChangeType) => { 
            switch (attributeChangeType.type) {
                case "checkbox":

                break;
            }
        }    
    };
}