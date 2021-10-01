const App = function () {
    let dropArea = null;
    let bankMapLoaded = false;
    let bankMap = new BankMap("banks.json", () => bankMapLoaded = true);
    const ynabConnect = new YNABConnect();
    const ynabSettings = new YNABSettings(ynabConnect);
    const converter = new Converter(bankMap, e => finishConvert(e));

    /**
     * Parse a file as a stream.
     * @param file {File} A file that should be converted.
     */
    const parseFile = function (file) {
        converter.clear();

        new CSVGood(file,
            (result) => {
                converter.convert(result);
            },
            (error) => {
                converter.handleError(error, file);
            },
            (result) => {
                converter.complete(result);
            }
        );
    };

    const finishConvert = (data) => {
        for (const key in Object.keys(data)) {
            console.log(key);

            ynabConnect.getBudgets().then(
                (budgets) => {
                    const budgetNames = [];
                    budgets.forEach(e => budgetNames.push(e.getName()))
                    new SelectionPopup("Which budget?", budgetNames, (e) => console.log(e));
                }
            );
            // ynabConnect
        }
    };

    const init = () => {
        document.getElementById("drop-input").addEventListener("change", () => {
            const _input = document.getElementById("drop-input");

            for (const file of _input.files)
                parseFile(file);

            _input.value = "";
        });

        dropArea = new DropArea((files) => {
            for (const file of files)
                parseFile(file);
        });

        document.getElementById("settings-cog").addEventListener("click", () => {
            ynabSettings.showYnabSettings();
        })
    };

    init();
};

window.addEventListener("load", () => new App());