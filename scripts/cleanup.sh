#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🧹 Cleaning up project structure...${NC}"

# Step 1: Create Essential Directories
# These are the core directories that EVERY project needs, regardless of use case
echo -e "\n${GREEN}Creating essential directories...${NC}"
mkdir -p src/components/layout    # For layout components (Nav, Sidebar)
mkdir -p src/components/ui        # For core UI components
mkdir -p src/lib/models          # For database models
mkdir -p src/styles              # For global styles

# Step 2: Remove Optional UI Components
# These are example or specialized components that not every project needs
echo -e "\n${GREEN}Removing unnecessary UI components...${NC}"
OPTIONAL_COMPONENTS=(
    "calendar.tsx"        # Specialized: Only needed for scheduling apps
    "navigation-menu.tsx" # Example: Shows navigation patterns
    "breadcrumb.tsx"     # Optional: Not all apps need breadcrumbs
    "pagination.tsx"     # Optional: For listing pages
    "dropdown-menu.tsx"  # Example: Shows dropdown patterns
    "accordion.tsx"      # Specialized: For FAQ/documentation
    "alert.tsx"         # Example: Shows notification patterns
    "avatar.tsx"        # Optional: For user profiles
    "badge.tsx"         # Optional: For notifications/labels
    "checkbox.tsx"      # Example: Form component
    "dialog.tsx"        # Example: Modal patterns
    "form.tsx"          # Example: Form handling
    "input.tsx"         # Example: Form component
    "label.tsx"         # Example: Form component
    "menubar.tsx"       # Specialized: For complex menus
    "popover.tsx"       # Example: Shows tooltip patterns
    "progress.tsx"      # Optional: For loading states
    "radio-group.tsx"   # Example: Form component
    "scroll-area.tsx"   # Specialized: For custom scrolling
    "select.tsx"        # Example: Form component
    "separator.tsx"     # Optional: For visual dividers
    "sheet.tsx"         # Specialized: For side panels
    "skeleton.tsx"      # Example: Loading states
    "slider.tsx"        # Specialized: For range inputs
    "switch.tsx"        # Example: Toggle component
    "table.tsx"         # Example: Data display
    "tabs.tsx"          # Example: Navigation pattern
    "textarea.tsx"      # Example: Form component
    "toast.tsx"         # Example: Notification system
    "toggle.tsx"        # Example: Button variant
    "tooltip.tsx"       # Example: Help text
)

# Remove each optional component if it exists
for component in "${OPTIONAL_COMPONENTS[@]}"; do
    rm -f "src/components/ui/$component"
done

# Step 3: Keep Essential UI Components
# These components are kept because they're fundamental to most web apps:
# - Button.tsx        # Every app needs buttons
# - Card.tsx         # Basic content container
# - ErrorBoundary.tsx # Error handling is essential
# - LoadingSpinner.tsx # Loading states are essential

# Step 4: Organize Layout Components
# Move layout components to their proper location
echo -e "\n${GREEN}Organizing files...${NC}"
# These moves might fail if files are already in the right place, that's OK
mv src/components/nav.tsx src/components/layout/Nav.tsx 2>/dev/null || true
mv src/components/dashboard/sidebar.tsx src/components/layout/Sidebar.tsx 2>/dev/null || true

# Step 5: Update Import Paths
# Update references to moved components
echo -e "\n${GREEN}Updating imports...${NC}"
# This might fail if files are already updated, that's OK
sed -i '' 's|@/components/nav|@/components/layout/Nav|g' src/app/layout.tsx 2>/dev/null || true

# Step 6: Clean Up Empty Directories
# Remove any empty directories left after reorganization
echo -e "\n${GREEN}Cleaning up empty directories...${NC}"
find src -type d -empty -delete

# Step 7: Show Final Structure
echo -e "\n${BLUE}✨ Project structure cleaned up successfully!${NC}"
echo -e "Project structure is now organized as follows:"
echo -e "${GREEN}"
# Show directory structure using tree if available, otherwise use ls
if command -v tree &> /dev/null; then
    tree src
else
    ls -R src
fi
echo -e "${NC}" 