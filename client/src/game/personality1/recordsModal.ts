import { Elem } from "../../core/elemm"
import { GoalRecord } from "../../shared/types";
import { Modal } from "../modal"

export const RecordsModal = (records: GoalRecord[]) => {
    let div = Elem("div", {}, [], { padding: "20px" });
    let messageDiv: HTMLDivElement;
    if (records.length == 0) {
        messageDiv = Elem("div",
            {innerText: "There are no records yet"}, [], {
                height: "100px",
                paddingBottom: "12px",
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
            }
        );
        div.appendChild(messageDiv);
    } else {
        div.append(...(records.map(record=>recordToElem(record))));
    }

    let modal = Modal("Records", "minimize", div);

    return {
        elem: modal,
        addRecord: (record: GoalRecord)=>{
            if (messageDiv != undefined) {messageDiv.remove();}
            div.prepend(recordToElem(record))
        },
        setVisible: ()=>{modal.style.display = "block";}
    }
}

const recordToElem = (record: GoalRecord) => {
    return Elem("div", {}, (()=>{
        let tr = Elem("tr");

        if (record.accepted) {
            //Score div
            //=========
            tr.appendChild(Elem("td", {}, [
                // Elem("div", {}, [
                Elem("div", {innerText: `+${record.score}`}, [], {
                    background: "linear-gradient(45deg, rgba(153,255,153,1) 3%, rgba(0,237,255,1) 100%)",
                    borderRadius: "5px",
                    height: "50px",
                    display: "flex",
                    justifyContent: "center",
                    flexDirection: "column",
                })
                // ], {
                //     textAlign: "center",
                    // background: "red"
                // })
            ], {width: "50px", paddingRight: "5px",}))
        }

        let rightChildren = Elem("div", {}, [
            //Description div
            //===============
            Elem("div", {innerText:
                record.description +
                (record.explanation != undefined ?
                    ` - ${record.explanation}` :
                    ""
                )
            })
        ], {
            width: "100%",
        });

        if (record.reason != undefined) {
            //Reason div
            //==========
            rightChildren.appendChild(Elem("div", {innerText: record.reason}, [], {
                background: record.accepted ? "#99ff99" : "#ff6666",
                borderRadius: "5px",
                padding: "5px",
                marginTop: "5px",
            }))
        }

        tr.appendChild(Elem("td", {}, [rightChildren]));

        return [Elem("table", {}, [tr], {
            textAlign: "center",
            minHeight: "50px",
            width: "100%",
            height: "100%",
        })];
    })(), {
        background: record.accepted ? "#66ff66" : "#ff4d4d",
        padding: "5px",
        margin: "10px",
        borderRadius: "10px",
    })
}