import { useRef, useState, useEffect } from "react";
import useKeyboardSound from "../hooks/useKeyboardSound";
import { useChatStore } from "../store/useChatStore";
import toast from "react-hot-toast";
import { Image, Send, X, Smile, Loader2 } from "lucide-react";

const EMOJI_LIST = ["👍", "❤️", "😂", "🔥", "🎉", "✨", "👏", "🚀", "🙌", "💯"];

function MessageInput() {
  const { playRandomKeyStrokeSound } = useKeyboardSound();
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef(null);
  const textInputRef = useRef(null);

  const { sendMessage, isSoundEnabled, isSendingMessage } = useChatStore();

  // Focus input when mounted
  useEffect(() => {
    textInputRef.current?.focus();
  }, []);

  // Handle Clipboard Image Paste (Ctrl+V / Cmd+V)
  const handlePaste = (e) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf("image") !== -1) {
        const file = items[i].getAsFile();
        if (file) {
          processImageFile(file);
          e.preventDefault();
          break;
        }
      }
    }
  };

  const processImageFile = (file) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be smaller than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
      toast.success("Image attached! Ready to send.");
    };
    reader.readAsDataURL(file);
  };

  const handleSendMessage = (e) => {
    if (e) e.preventDefault();
    if (!text.trim() && !imagePreview) return;
    if (isSendingMessage) return;

    if (isSoundEnabled) playRandomKeyStrokeSound();

    sendMessage({
      text: text.trim(),
      image: imagePreview,
    });

    setText("");
    setImagePreview(null);
    setShowEmojiPicker(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
    textInputRef.current?.focus();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) processImageFile(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleEmojiClick = (emoji) => {
    setText((prev) => prev + emoji);
    textInputRef.current?.focus();
  };

  // Drag and drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processImageFile(file);
  };

  return (
    <div
      className={`p-3 md:p-4 border-t border-slate-800/80 bg-slate-950/95 backdrop-blur-xl flex-shrink-0 transition-colors ${
        isDragging ? "bg-cyan-950/30 border-cyan-500/50" : ""
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Attached Image Preview */}
      {imagePreview && (
        <div className="max-w-3xl mx-auto mb-3 flex items-center justify-between gap-4 rounded-2xl border border-cyan-500/30 bg-slate-900/90 p-3 shadow-lg animate-fadeIn">
          <div className="relative group">
            <img
              src={imagePreview}
              alt="Attached preview"
              className="w-20 h-20 object-cover rounded-xl border border-slate-700"
            />
            <button
              type="button"
              onClick={removeImage}
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center shadow-md transition focus-visible:ring-2 focus-visible:ring-rose-400"
              aria-label="Remove attached image"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="flex-1 min-w-0 text-left">
            <p className="text-slate-200 text-xs font-semibold">Image attachment ready</p>
            <p className="text-slate-400 text-[11px] truncate">Press Enter or click Send to deliver.</p>
          </div>
        </div>
      )}

      {/* Emoji Quick Tray */}
      {showEmojiPicker && (
        <div className="max-w-3xl mx-auto mb-2.5 p-2 bg-slate-900/95 border border-slate-800 rounded-2xl shadow-xl flex items-center gap-1.5 overflow-x-auto scrollbar-none animate-scaleIn">
          <span className="text-[11px] font-semibold text-slate-400 px-2 select-none">Quick Reactions:</span>
          {EMOJI_LIST.map((emoji, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleEmojiClick(emoji)}
              className="p-1.5 hover:bg-slate-800 rounded-xl text-base transition-transform active:scale-125 focus-visible:ring-2 focus-visible:ring-cyan-400"
              aria-label={`Insert ${emoji}`}
            >
              {emoji}
            </button>
          ))}
        </div>
      )}

      {/* Input Form */}
      <form
        onSubmit={handleSendMessage}
        className="max-w-3xl mx-auto flex items-center gap-2"
        aria-label="Message composer"
      >
        {/* Hidden File Input */}
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageChange}
          className="hidden"
          aria-hidden="true"
        />

        {/* Media Attach Button */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="p-2.5 md:p-3 text-slate-400 hover:text-cyan-400 hover:bg-slate-900/90 border border-slate-800/80 hover:border-cyan-500/40 rounded-2xl transition duration-150 flex-shrink-0 focus-visible:ring-2 focus-visible:ring-cyan-400"
          aria-label="Attach an image (or paste from clipboard)"
          title="Attach image"
        >
          <Image className="w-5 h-5" />
        </button>

        {/* Emoji Bar Toggle Button */}
        <button
          type="button"
          onClick={() => setShowEmojiPicker((prev) => !prev)}
          className={`p-2.5 md:p-3 rounded-2xl border transition duration-150 flex-shrink-0 focus-visible:ring-2 focus-visible:ring-cyan-400 ${
            showEmojiPicker
              ? "text-cyan-300 border-cyan-500/40 bg-cyan-950/40"
              : "text-slate-400 hover:text-cyan-400 hover:bg-slate-900/90 border-slate-800/80"
          }`}
          aria-label="Toggle emoji picker"
          title="Emoji reactions"
        >
          <Smile className="w-5 h-5" />
        </button>

        {/* Main Text Input */}
        <div className="relative flex-1">
          <input
            ref={textInputRef}
            type="text"
            value={text}
            onPaste={handlePaste}
            onChange={(e) => {
              setText(e.target.value);
              if (isSoundEnabled) playRandomKeyStrokeSound();
            }}
            placeholder="Type a message (or paste an image with Ctrl+V)…"
            aria-label="Type message"
            className="w-full rounded-2xl border border-slate-800 bg-slate-900/90 py-3 pl-4 pr-4 text-xs md:text-sm text-slate-100 placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 transition-all shadow-inner"
          />
        </div>

        {/* Send Button */}
        <button
          type="submit"
          disabled={(!text.trim() && !imagePreview) || isSendingMessage}
          className="inline-flex items-center justify-center p-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 text-slate-950 font-bold shadow-md shadow-cyan-500/20 transition duration-150 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none flex-shrink-0 focus-visible:ring-2 focus-visible:ring-cyan-300"
          aria-label="Send message"
          title="Send message"
        >
          {isSendingMessage ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </button>
      </form>
    </div>
  );
}

export default MessageInput;