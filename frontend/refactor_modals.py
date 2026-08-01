import os
import re

directory = r"c:\Users\ADMIN\Desktop\Bellwin ERP Full Project\frontend (2) (1)\src\pages\admin\loan-config"

files_to_process = [
    "VehicleMaster.jsx",
    "GoldRateMaster.jsx",
    "PurityMaster.jsx",
    "LockerMaster.jsx",
    "LoanScheme.jsx",
    "ItemGroupMaster.jsx",
    "DealerMaster.jsx"
]

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Remove Modal import
    content = re.sub(r"import\s+Modal\s+from\s+['\"].*?Modal['\"];?\n?", "", content)

    # 2. Add ArrowLeft to lucide-react if not present
    lucide_match = re.search(r"import\s+\{([^}]+)\}\s+from\s+['\"]lucide-react['\"]", content)
    if lucide_match:
        imports = [i.strip() for i in lucide_match.group(1).split(',')]
        if 'ArrowLeft' not in imports:
            imports.append('ArrowLeft')
            new_import = f"import {{ {', '.join(imports)} }} from 'lucide-react'"
            content = content[:lucide_match.start()] + new_import + content[lucide_match.end():]

    # 3. Rename modalOpen -> isFormOpen
    content = content.replace("modalOpen", "isFormOpen")
    content = content.replace("setModalOpen", "setIsFormOpen")

    # 4. Extract Modal block
    # Regex to find <Modal ... > ... </Modal>
    # We'll use a simple approach since we know the structure
    modal_start_idx = content.find("<Modal")
    if modal_start_idx == -1:
        print(f"No Modal found in {filepath}")
        return

    # Find the end of Modal
    modal_end_idx = content.find("</Modal>", modal_start_idx) + len("</Modal>")
    modal_block = content[modal_start_idx:modal_end_idx]

    # Extract title
    title_match = re.search(r"title=\{([^}]+)\}", modal_block)
    title_expr = title_match.group(1) if title_match else "'Form'"

    # Extract save button text
    save_btn_match = re.search(r"<Button[^>]*onClick=\{handleSave\}[^>]*>\s*(.*?)\s*</Button>", modal_block)
    save_btn_text = save_btn_match.group(1) if save_btn_match else "Save"

    # Extract form content
    form_start_match = re.search(r"<form[^>]*>", modal_block)
    form_end_match = re.search(r"</form>", modal_block)
    
    if not form_start_match or not form_end_match:
        print(f"No form found inside Modal in {filepath}")
        return
        
    form_tag = form_start_match.group(0)
    form_inner = modal_block[form_start_match.end():form_end_match.start()].strip()

    # Style inputs if possible (bg-gray-50 etc) - we'll just keep it as is for simplicity, 
    # but we will append the buttons inside the form.

    buttons_html = f"""
            <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-100 mt-6">
              <Button 
                type="button" 
                onClick={{() => setIsFormOpen(false)}} 
                variant="secondary"
                className="px-6 py-2.5"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                variant="primary" 
                loading={{loading}}
                className="px-8 py-2.5 shadow-md hover:shadow-lg transition-all"
              >
                {save_btn_text}
              </Button>
            </div>"""

    new_form_block = f"""{form_tag}
          {form_inner}
          {buttons_html}
        </form>"""

    # Build the full screen form UI
    full_screen_ui = f"""  if (isFormOpen) {{
    return (
      <div className="max-w-4xl mx-auto px-4 py-6 animate-fade-in">
        <div className="flex items-center gap-4 mb-6">
          <button 
            onClick={{() => setIsFormOpen(false)}}
            className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-xl transition-colors"
          >
            <ArrowLeft size={{24}} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {{{title_expr}}}
            </h1>
          </div>
        </div>

        <Card className="p-8 shadow-lg border border-gray-100">
          {new_form_block}
        </Card>
      </div>
    );
  }}

  return ("""

    # Replace the modal block with empty string
    content = content[:modal_start_idx] + content[modal_end_idx:]

    # Add animate-fade-in to the main wrapper
    content = content.replace('className="max-w-7xl mx-auto px-4 py-6"', 'className="max-w-7xl mx-auto px-4 py-6 animate-fade-in"')
    
    # Add shadow-sm to the Search card
    content = content.replace('<Card className="p-4 mb-6">', '<Card className="p-4 mb-6 shadow-sm border border-gray-100">')

    # Find `return (` at the bottom (usually the main return)
    # Since we removed Modal, we just replace `return (` with `full_screen_ui`
    # But wait, there might be multiple `return (`. We want the one inside the component.
    # The last `return (` before the closing tag.
    
    # Actually, a better way to find the main return is searching for `return (` after `filtered` or `handleDelete`
    main_return_idx = content.rfind('  return (')
    if main_return_idx != -1:
        content = content[:main_return_idx] + full_screen_ui + content[main_return_idx + len('  return ('):]
    else:
        print(f"Could not find main return in {filepath}")
        return

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"Processed {filepath}")

for filename in files_to_process:
    process_file(os.path.join(directory, filename))
