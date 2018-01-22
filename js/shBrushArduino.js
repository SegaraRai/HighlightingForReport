; (function() {
  // CommonJS
  SyntaxHighlighter = SyntaxHighlighter || (typeof require !== 'undefined' ? require('shCore').SyntaxHighlighter : null);

  function getFunctions(str) {
    return str
      .split(/\s+/)
      .filter(v => v)
      .map(v => `\\b${v}(?=\\s*\\()`)
      .join('|');
  }

  function Brush() {
    // Based on shBrushCpp.js
    // Copyright 2006 Shin, YoungJin, Rai

    var datatypes = 'unsigned signed const constexpr scope static volatile' +
      'String array bool boolean byte char double float int long short string void word ' +
      'size_t wchar_t char16_t char32_t int8_t int16_t int32_t int64_t uint8_t uint16_t uint32_t uint64_t div_t ldiv_t';

    var keywords = 'alignas alignof auto break case catch class decltype __finally __exception __try ' +
      'const_cast continue private public protected __declspec ' +
      'default delete deprecated dllexport dllimport do dynamic_cast ' +
      'else enum explicit extern if for friend goto inline ' +
      'mutable naked namespace new noinline noreturn nothrow noexcept nullptr ' +
      'ref register reinterpret_cast return selectany ' +
      'sizeof static static_cast static_assert struct switch template this ' +
      'thread thread_local throw true false try typedef typeid typename union ' +
      'using uuid virtual volatile whcar_t while ' +
      'setup loop Serial Serial1 Serial2 Serial3 PROGMEM';

    var constants = 'HIGH LOW INPUT OUTPUT INPUT_PULLUP LED_BUILTIN';

    var functions = 'delay delayMicroseconds micros millis ' +
      'pinMode digitalRead digitalWrite analogRead analogReference analogWrite analogReadResolution analogWriteResolution noTone pulseIn pulseInLong shiftIn shiftOut tone ' +
      'abs constrain map max min pow sq sqrt cos sin tan random randomSeed bit bitClear bitRead bitSet bitWrite highByte lowByte ' +
      'isAlpha isAlphaNumeric isAscii isControl isDigit isGraph isHexadecimalDigit isLowerCase isPrintable isPunct isSpace isUpperCase isWhitespace ' +
      'attachInterrupt detachInterrupt interrupts noInterrupts ' +
      'available availableForWrite begin end find findUntil flush parseFloat parseInt peek print println read readBytes readBytesUntil setTimeout write serialEvent ' +
      'charAt compareTo concat c_str endsWith equals equalsIgnoreCase getBytes indexOf lastIndexOf length remove replace reserve setCharAt StartsWith substring toCharArray toInt toFloat toLowerCase toUpperCase trim ' +
      'assert isalnum isalpha iscntrl isdigit isgraph islower isprint' +
      'ispunct isspace isupper isxdigit tolower toupper errno localeconv ' +
      'setlocale acos asin atan atan2 ceil cos cosh exp fabs floor fmod ' +
      'frexp ldexp log log10 modf pow sin sinh sqrt tan tanh ' +
      'longjmp setjmp raise signal va_arg va_end va_start ' +
      'clearerr fclose feof ferror fflush fgetc fgetpos fgets fopen ' +
      'fprintf fputc fputs fread freopen fscanf fseek fsetpos ftell ' +
      'fwrite getc getchar gets perror printf putc putchar puts remove ' +
      'rename rewind scanf setbuf setvbuf sprintf sscanf tmpfile tmpnam ' +
      'ungetc vfprintf vprintf vsprintf abort abs atexit atof atoi atol ' +
      'bsearch calloc div exit free getenv labs ldiv malloc mblen mbstowcs ' +
      'mbtowc qsort rand realloc srand strtod strtol strtoul system ' +
      'wcstombs wctomb memchr memcmp memcpy memmove memset strcat strchr ' +
      'strcmp strcoll strcpy strcspn strerror strlen strncat strncmp ' +
      'strncpy strpbrk strrchr strspn strstr strtok strxfrm asctime ' +
      'clock ctime difftime gmtime localtime mktime strftime time';


    this.regexList = [
      {regex: SyntaxHighlighter.regexLib.singleLineCComments, css: 'comments'},   // one line comments
      {regex: SyntaxHighlighter.regexLib.multiLineCComments, css: 'comments'},    // multiline comments
      {regex: SyntaxHighlighter.regexLib.doubleQuotedString, css: 'string'},      // strings
      {regex: SyntaxHighlighter.regexLib.singleQuotedString, css: 'string'},      // strings
      {regex: /^ *#.*/gm, css: 'preprocessor'},
      {regex: new RegExp(this.getKeywords(datatypes), 'gm'), css: 'color1 bold'},
      {regex: new RegExp(getFunctions(functions), 'gm'), css: 'functions bold'},
      {regex: new RegExp(this.getKeywords(keywords), 'gm'), css: 'keyword bold'},
      {regex: new RegExp(this.getKeywords(constants), 'gm'), css: 'constants bold'},
      //{regex: /[A-Za-z_]\w*(?=\s*\()/gm, css: 'functions bold'},
      //{regex: /\b(?:[A-Z_][\dA-Z_]*)\b/gm, css: 'constants bold'},
    ];
  };

  Brush.prototype = new SyntaxHighlighter.Highlighter();
  Brush.aliases = ['arduino', 'ino'];

  SyntaxHighlighter.brushes.Arduino = Brush;

  // CommonJS
  typeof (exports) != 'undefined' ? exports.Brush = Brush : null;
})();
