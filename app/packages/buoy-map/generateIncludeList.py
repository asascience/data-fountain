import os


def get_filepaths(directory):
    """
    This function will generate the file names in a directory
    tree by walking the tree either top-down or bottom-up. For each
    directory in the tree rooted at directory top (including top itself),
    it yields a 3-tuple (dirpath, dirnames, filenames).
    """
    file_paths = []  # List which will store all of the full filepaths.

    # Walk the tree.
    for root, directories, files in os.walk(directory):
        for filename in files:
            # Join the two strings in order to form the full filepath.
            filepath = os.path.join(root, filename)
            file_paths.append(filepath)  # Add it to the list.

    return file_paths  # Self-explanatory.

# Define what directories should be monitored
paths = ['client', 'public', 'localize']

# Run the above function and store its results in a variable.
target = open('filename.txt', 'w')

for path in paths:
    full_file_paths = get_filepaths(path)

    target.write("api.addAssets([\n")
    for file in full_file_paths:
        if '.DS_Store' not in file:
            target.write("\t\'%s\',\n" % file)

    target.write("\t], [\'client\']);\n\r")

target.close()
