    "use client";

    import CodeMirror from "@uiw/react-codemirror";
    import { json } from "@codemirror/lang-json";
    import { dracula } from "@uiw/codemirror-theme-dracula";

    export default function JsonEditor({ value, onChange }) {
    return (
        <div className="mb-4">
        <label className="text-gray-800 font-bold mb-2 block">Popups (JSON Format)</label>
        <CodeMirror
            value={value}
            height="200px"
            extensions={[json()]}
            theme={dracula}
            onChange={onChange}
            className="border rounded-md"
        />
        </div>
    );
    }
