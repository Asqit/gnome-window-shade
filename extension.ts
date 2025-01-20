import GLib from "gi://GLib";
import Gio from "gi://Gio";
import Meta from "gi://Meta";
import Shell from "gi://Shell";
import * as Main from "resource:///org/gnome/shell/ui/main.js";
import { Extension } from "resource:///org/gnome/shell/extensions/extension.js";

// Initial Idea - because I am lost in the sea of gnome
// 1. We listen for key shortcut
// 2. We toggle between 0-600 for height of the current window
// 3. improve...

export default class WindowShade extends Extension {
  readonly SHORTCUT_NAME: string = "window-shade";
  settings: Gio.Settings = new Gio.Settings({
    schema: "org.gnome.shell.extensions.window-shade",
  });

  private getCurrentWindow(): Meta.Window | null {
    const tracker = Shell.WindowTracker.get_default();
    return tracker.focus_app?.get_windows()[0];
  }

  private onShortcutActivated() {
    const currentWindow = this.getCurrentWindow();
    if (!currentWindow) {
      log("error: failed to get current window");
      return;
    }

    const frameRect = currentWindow.get_frame_rect();
    const { height, x, y, width } = frameRect;
    let newHeight: number = 0;

    if (height === 0) {
      newHeight = 600;
    }

    currentWindow.move_resize_frame(true, x, y, width, newHeight);
    log(`resized current window to ${newHeight}px of height`);
  }

  enable() {
    log("extension was activated");
    Main.wm.addKeybinding(
      this.SHORTCUT_NAME,
      this.settings,
      Meta.KeyBindingFlags.NONE,
      Shell.ActionMode.ALL,
      this.onShortcutActivated,
    );
  }

  disable() {
    log("extension was disabled");
    Main.wm.removeKeybinding(this.SHORTCUT_NAME);
  }
}
