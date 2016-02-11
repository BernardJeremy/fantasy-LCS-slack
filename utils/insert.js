module.exports = function (stack, needle, after) {
  var index = stack.indexOf(after);

  if (index == -1) {
    return '';
  }

  return stack.substring(0, index) + needle + stack.substring(index);
};
